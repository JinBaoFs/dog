import { formatEther, getAddress, Hash, parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import {
  APPROVE_AMOUNT,
  BUY_SELL_ADDRESS,
  DIALECT_ADDRESS,
  FACTORY_address,
  POOL_ADDRESS,
  USDT_ADDRESS,
  GAS_FEE,
  WHITELIST_ADDRESS
} from '@/constants';
import { ERC20 } from '@/constants/abi/erc20';
import {
  useMultipleContractSingleData,
  useSingleCallResult
} from '@/state/multicall/hooks';
import {
  useUpdateTxModalStatus,
  useCheckSpreadName
} from '@/state/userInfo/hook';
import { ajaxGet } from '@/api/axios';
import { axiosUrlType } from '@/api/type';
import { ConfigDetail } from '@/types/global';
import { BUY_SELL_ABI } from '@/constants/abi/buySell';
import { formatNumber, formatNumberToK } from '@/lib';
import { Factory } from '@/constants/abi/IUniswapV2Factory';
import { PAIR } from '@/constants/abi/IUniswapV2Pair';
import { ApproveState, useApproveCallBack } from './useApproveCallback';
import { useGetUserCardInfo } from './useMint';

export const usePair = () => {
  const pairAddress = useSingleCallResult({
    address: FACTORY_address,
    functionName: 'getPair',
    abi: Factory,
    args: [USDT_ADDRESS, DIALECT_ADDRESS]
  });

  const payload = {
    address: pairAddress?.result as never as Hash,
    abi: PAIR,
    args: []
  } as const;

  const pairReserves = useSingleCallResult({
    ...payload,
    functionName: 'getReserves'
  });

  const token0 = useSingleCallResult({
    ...payload,
    functionName: 'token0'
  });
  const token1 = useSingleCallResult({
    ...payload,
    functionName: 'token1'
  });

  const tokenTotalSupply = useSingleCallResult({
    ...payload,
    functionName: 'totalSupply',
    args: [],
    address: DIALECT_ADDRESS
  });

  const mintPoolBalanceOf = useSingleCallResult({
    ...payload,
    functionName: 'balanceOf',
    address: DIALECT_ADDRESS,
    args: [POOL_ADDRESS as Hash]
  });

  const [resives0, resives1] = useMemo(() => {
    if (!pairReserves?.result) return [0n, 0n];
    const [_resives0, _resives1] = pairReserves.result;
    return getAddress(`${token0.result}`) === getAddress(USDT_ADDRESS)
      ? [_resives0, _resives1]
      : [_resives1, _resives0];
  }, [pairReserves, token0]);

  return {
    pairReserves,
    token0,
    token1,
    tokenTotalSupply,
    mintPoolBalanceOf,
    pairAddress,
    resives0,
    resives1
  };
};

const useSwap = () => {
  const t = useTranslations('SwapPage');

  const [index, setIndex] = useState(0);
  const [val, setVal] = useState('');
  const [getVal, setGetVal] = useState('');
  const updateTxStatux = useUpdateTxModalStatus();
  const checkSpreadName = useCheckSpreadName();
  const userCardInfo = useGetUserCardInfo();
  const { writeContractAsync } = useWriteContract();

  const { data: configData } = useSWR<ConfigDetail>('config', (url: any) =>
    ajaxGet(url as axiosUrlType)
  );

  const [, quota] = useMemo(() => {
    return userCardInfo?.result || [0, 0n, 0n];
  }, [userCardInfo]);

  const { address } = useAccount();
  const balanceOf = useMultipleContractSingleData({
    addresses: [USDT_ADDRESS, DIALECT_ADDRESS],
    functionName: 'balanceOf',
    abi: ERC20,
    args: [address as Hash]
  });

  const { result: isMarketer } = useSingleCallResult({
    abi: ERC20,
    functionName: 'isMarketer',
    address: DIALECT_ADDRESS,
    args: [WHITELIST_ADDRESS as Hash]
  });

  const { approvalState: approvalState0, approveCallback: approveCallback0 } =
    useApproveCallBack({
      token: USDT_ADDRESS,
      amountToApprove: APPROVE_AMOUNT,
      spender: BUY_SELL_ADDRESS as Hash
    });

  const { approvalState: approvalState1, approveCallback: approveCallback1 } =
    useApproveCallBack({
      token: DIALECT_ADDRESS,
      amountToApprove: APPROVE_AMOUNT,
      spender: BUY_SELL_ADDRESS as Hash
    });

  const approvalState = useMemo(() => {
    return index ? approvalState1 : approvalState0;
  }, [index, approvalState1, approvalState0]);

  const approveCallback = useMemo(() => {
    return index ? approveCallback1 : approveCallback0;
  }, [index, approveCallback1, approveCallback0]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target && /^\d{0,9}(?:\.\d{0,6})?$/.test(e.target.value)) {
        setVal(e.target.value);
      }
    },
    [setVal]
  );

  const {
    pairReserves,
    resives0,
    resives1,
    token0,
    token1,
    tokenTotalSupply,
    mintPoolBalanceOf
  } = usePair();

  const tokenInfo = useMemo(() => {
    if (
      token0?.result &&
      token1?.result &&
      pairReserves?.result &&
      tokenTotalSupply?.result &&
      mintPoolBalanceOf?.result
    ) {
      const USDT = formatNumber(formatEther(resives0 as bigint));
      const Token = formatNumber(formatEther(resives1 as bigint));

      const circulation =
        (tokenTotalSupply.result as never) -
        (mintPoolBalanceOf.result as never);
      const price = formatNumber(`${+USDT / +Token}`);

      return {
        USDT,
        Token,
        price,
        circulation: formatNumberToK(formatEther(BigInt(circulation))),
        market: +formatEther(BigInt(circulation)) * +price
      };
    }
    return {
      USDT: 0,
      Token: 0,
      price: 0,
      circulation: 0,
      market: 0
    };
  }, [
    token0,
    resives0,
    resives1,
    pairReserves,
    tokenTotalSupply,
    mintPoolBalanceOf,
    token1
  ]);

  const handlerMax = useCallback(() => {
    const _val = formatEther((balanceOf[index]?.result as never) || 0n);
    setVal(formatNumber(_val));
  }, [index, balanceOf]);

  useEffect(() => {
    if (index && configData?.sell_rate) {
      setGetVal(`${+val * +tokenInfo.price * (+configData.sell_rate / 100)}`);
    } else {
      setGetVal(`${(+val / +tokenInfo.price) * 0.1999}`);
    }
  }, [index, tokenInfo, val, setGetVal, configData]);

  const text = useMemo(() => (!index ? t('Buy') : t('Sell')), [index, t]);

  const btnStatus = useMemo(() => {
    if (approvalState !== ApproveState.APPROVE || !tokenInfo.price) {
      return {
        isDisabled: true,
        text
      };
    }
    if (!val) {
      return {
        isDisabled: true,
        text: t('Enter Quantity')
      };
    }
    //额度不足

    if (+val > +formatEther((balanceOf[index]?.result as never) || 0n)) {
      return {
        isDisabled: true,
        text: t('Insufficient balance')
      };
    }

    //购买额度不足
    if (!index && +val > +formatEther(quota || 0n)) {
      return {
        isDisabled: true,
        text: t('Insufficient Purchase Amount')
      };
    }
    return {
      isDisabled: false,
      text
    };
  }, [val, t, balanceOf, tokenInfo, index, approvalState, text, quota]);

  const handApprove = useCallback(async () => {
    try {
      updateTxStatux({
        status: 'pending'
      });
      await approveCallback();
      updateTxStatux({
        status: 'success'
      });
    } catch (error) {
      updateTxStatux({
        status: null
      });
    }
  }, [approveCallback, updateTxStatux]);

  const handleBtn = useCallback(async () => {
    checkSpreadName();
    if (!isMarketer) return;
    try {
      updateTxStatux({
        status: 'pending'
      });
      await writeContractAsync({
        address: BUY_SELL_ADDRESS,
        abi: BUY_SELL_ABI,
        functionName: index ? 'tokenIn' : 'usdtIn',
        args: [parseEther(val)],
        value: GAS_FEE as any
      });
      updateTxStatux({
        status: 'success'
      });
      setVal('');
      setGetVal('');
    } catch (error) {
      console.log(error);

      setVal('');
      setGetVal('');
      updateTxStatux({
        status: 'fail'
      });
    }
  }, [
    updateTxStatux,
    setVal,
    setGetVal,
    writeContractAsync,
    index,
    val,
    checkSpreadName,
    isMarketer
  ]);

  return {
    balanceOf,
    index,
    setIndex,
    approvalState,
    handApprove,
    handlerMax,
    val,
    onChange,
    getVal,
    price: tokenInfo.price,
    btnStatus,
    handleBtn,
    quota,
    tokenInfo,
    configData
  };
};

export default useSwap;
