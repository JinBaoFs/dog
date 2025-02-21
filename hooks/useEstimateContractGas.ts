import { useCallback, useEffect, useState } from 'react';
import { EstimateContractGasParameters } from 'viem';
import { useBlockNumber, usePublicClient } from 'wagmi';
import { useVisible } from './useVisible';

const useEstimateContractGas = (
  approveParams: EstimateContractGasParameters
) => {
  const publicClient = usePublicClient();
  const [gas, setGas] = useState<bigint>(BigInt(0));
  const visible = useVisible();
  const { data } = useBlockNumber();

  const getGas = useCallback(async () => {
    const estimatedGas = await publicClient?.estimateContractGas(approveParams);
    setGas(estimatedGas as bigint);
  }, [setGas, approveParams, publicClient]);

  useEffect(() => {
    if (!visible || !approveParams.address) return;
    getGas();
  }, [getGas, visible, approveParams, data]);

  return gas;
};

export default useEstimateContractGas;
