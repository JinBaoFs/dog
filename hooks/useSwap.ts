import { formatEther, Hash, parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  APPROVE_AMOUNT,
  BUY_SELL_ADDRESS,
  DOG_ADDRESS,
  USDT_ADDRESS
} from '@/constants';
import { ERC20 } from '@/constants/abi/erc20';
import { useMultipleContractSingleData } from '@/state/multicall/hooks';
import {
  useUpdateTxModalStatus,
  useCheckSpreadName
} from '@/state/userInfo/hook';
import { BUY_SELL_ABI } from '@/constants/abi/buySell';
import { formatNumber } from '@/lib';
import { ApproveState, useApproveCallBack } from './useApproveCallback';
import { useGetUserCardInfo } from './useMint';

const useSwap = () => {
  const t = useTranslations('SwapPage');

  const [index, setIndex] = useState(0);
  const [price, setPrice] = useState(0);
  const [val, setVal] = useState('');
  const [getVal, setGetVal] = useState('');
  const updateTxStatux = useUpdateTxModalStatus();
  const checkSpreadName = useCheckSpreadName();
  const userCardInfo = useGetUserCardInfo();
  const { writeContractAsync } = useWriteContract();

  const [, quota] = useMemo(() => {
    return userCardInfo?.result || [0, 0n, 0n];
  }, [userCardInfo]);

  const { address } = useAccount();
  const balanceOf = useMultipleContractSingleData({
    addresses: [USDT_ADDRESS, DOG_ADDRESS],
    functionName: 'balanceOf',
    abi: ERC20,
    args: [address as Hash]
  });

  const { approvalState: approvalState0, approveCallback: approveCallback0 } =
    useApproveCallBack({
      token: USDT_ADDRESS,
      amountToApprove: APPROVE_AMOUNT,
      spender: BUY_SELL_ADDRESS as Hash
    });

  const { approvalState: approvalState1, approveCallback: approveCallback1 } =
    useApproveCallBack({
      token: DOG_ADDRESS,
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

  const onChangePrice = useCallback(
    (newPrice: number) => {
      setPrice(newPrice);
    },
    [setPrice]
  );

  const handlerMax = useCallback(() => {
    const _val = formatEther((balanceOf[index]?.result as never) || 0n);
    setVal(formatNumber(_val));
  }, [index, balanceOf]);

  useEffect(() => {
    if (index) {
      setGetVal(`${+val * +price * 0.85}`);
    } else {
      setGetVal(`${(+val / +price) * 0.3}`);
    }
  }, [index, price, val, setGetVal]);

  const text = useMemo(() => (!index ? t('Buy') : t('Sell')), [index, t]);

  const btnStatus = useMemo(() => {
    if (approvalState !== ApproveState.APPROVE || !price) {
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
    return {
      isDisabled: false,
      text
    };
  }, [val, t, balanceOf, price, index, approvalState, text]);

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
    try {
      updateTxStatux({
        status: 'pending'
      });
      await writeContractAsync({
        address: BUY_SELL_ADDRESS,
        abi: BUY_SELL_ABI,
        functionName: index ? 'tokenIn' : 'usdtIn',
        args: [parseEther(val)]
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
    checkSpreadName
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
    price,
    btnStatus,
    handleBtn,
    quota,
    onChangePrice
  };
};

export default useSwap;
