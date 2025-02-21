import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { Currency } from '@/constants/currency';
import { ChainId } from '@/constants';

const useWNATIVE = () => {
  const { chain } = useAccount();
  return useMemo(() => Currency.ENATIVE[chain?.id as ChainId], [chain]);
};

export default useWNATIVE;
