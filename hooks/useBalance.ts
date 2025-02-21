import { useEffect } from 'react';
import { Hash } from 'viem';
import { useBlockNumber, useBalance as useBalanceWagmi } from 'wagmi';
import { useVisible } from './useVisible';

export const useBalance = ({ address }: { address?: Hash }) => {
  const visible = useVisible();
  const { data: blockNumber } = useBlockNumber({ watch: visible });
  const { refetch, ...data } = useBalanceWagmi({
    address: address
  });

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);
  return data;
};
