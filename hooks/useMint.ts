import { formatEther, Hash } from 'viem';
import { useCallback, useMemo } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { useDisclosure } from '@chakra-ui/react';
import {
  APPROVE_AMOUNT,
  BUY_SELL_ADDRESS,
  MINT_ADDRESS,
  USDT_ADDRESS
} from '@/constants';
import {
  useUpdateTxModalStatus,
  useUserInfo,
  useCheckSpreadName
} from '@/state/userInfo/hook';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { BUY_SELL_ABI } from '@/constants/abi/buySell';
import { axiosUrlType } from '@/api/type';
import { NFTDetail, NFTList } from '@/types/global';
import { ajaxGet } from '@/api/axios';
import { ERC20 } from '@/constants/abi/erc20';
import { QUOTA_ABI } from '@/constants/abi/quota';
import REQUEST_API from '@/api/api';
import { ApproveState, useApproveCallBack } from './useApproveCallback';

export const useGetUserCardInfo = () => {
  const { address } = useAccount();

  const userCardInfo = useSingleCallResult({
    address: BUY_SELL_ADDRESS,
    functionName: 'getUserCardInfo',
    abi: BUY_SELL_ABI,
    args: [address as Hash]
  });

  return userCardInfo;
};

const useMint = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userInfo = useUserInfo();

  const { data, isLoading } = useSWR<{ list: NFTDetail }>(
    userInfo ? '/nft/1' : 'nft',
    (url: any) => ajaxGet(url as axiosUrlType)
  );

  const { data: nftlist } = useSWR<NFTList>(REQUEST_API.allNft, (url: any) =>
    ajaxGet(url as axiosUrlType)
  );

  const t = useTranslations('MintPage');
  const swapPageT = useTranslations('SwapPage');
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const userCardInfo = useGetUserCardInfo();

  const balance = useSingleCallResult({
    address: USDT_ADDRESS,
    functionName: 'balanceOf',
    abi: ERC20,
    args: [address as Hash]
  });

  // console.log(userCardInfo, balance);

  const updateTxStatux = useUpdateTxModalStatus();
  const checkSpreadName = useCheckSpreadName();
  const { approvalState, approveCallback } = useApproveCallBack({
    token: USDT_ADDRESS,
    amountToApprove: APPROVE_AMOUNT,
    spender: MINT_ADDRESS as Hash
  });

  const [level, quota, price] = useMemo(() => {
    return userCardInfo?.result || [0, 0n, 0n];
  }, [userCardInfo]);

  const userNFTInfo = useMemo(() => {
    if (!nftlist) return {};
    const _level = +level.toString();

    return {
      current: nftlist.list[_level === 5 ? 4 : _level ? _level - 1 : 0],
      next: nftlist.list[_level === 5 ? 4 : _level]
    };
  }, [level, nftlist]);

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

  const handBtn = useCallback(async () => {
    checkSpreadName();
    onOpen();
  }, [onOpen, checkSpreadName]);

  const comfirBuy = useCallback(async () => {
    try {
      updateTxStatux({
        status: 'pending'
      });
      await writeContractAsync({
        address: MINT_ADDRESS,
        abi: QUOTA_ABI,
        functionName: 'mint',
        args: []
      });
      onClose();
      updateTxStatux({
        status: 'success'
      });
    } catch (error) {
      updateTxStatux({
        status: 'fail'
      });
    }
  }, [onClose, updateTxStatux, writeContractAsync]);

  const text = useMemo(() => {
    if (!level) return t('Mint');
    if (level === 5) return t('Renewal');
    return t('Upgrade');
  }, [level, t]);

  const btnStatus = useMemo(() => {
    if (approvalState !== ApproveState.APPROVE) {
      return {
        disabled: true,
        text
      };
    }

    if (
      data &&
      data?.list.price > +formatEther(balance.result as never as bigint)
    ) {
      return {
        disabled: true,
        text: swapPageT('Insufficient balance')
      };
    }

    return {
      disabled: false,
      text
    };
  }, [data, text, swapPageT, balance, approvalState]);

  return {
    approvalState,
    handApprove,
    btnStatus,
    data,
    userNFTInfo,
    isLoading,
    handBtn,
    level,
    quota,
    price,
    isOpen,
    onOpen,
    onClose,
    comfirBuy
  };
};

export default useMint;
