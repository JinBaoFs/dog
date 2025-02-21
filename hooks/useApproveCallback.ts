import { Hash, TransactionReceipt } from 'viem';
import { useAccount } from 'wagmi';
import { useCallback, useMemo } from 'react';
import {
  waitForTransactionReceipt,
  writeContract,
  type WriteContractParameters
} from '@wagmi/core';
import { ExtractAbiFunctionNames } from 'abitype';
import { ERC20 } from '@/constants/abi/erc20';
import { useSingleCallResult } from '@/state/multicall/hooks';
import {
  useAllTransactions
  // useTransactionAdder
} from '@/state/transactions/hooks';
import { Currency } from '@/constants/currency';
import { config } from '@/constants/wagmi';
import { MAX_UNIT256 } from '@/constants';
import useWNATIVE from './useWNATIVE';
import useEstimateContractGas from './useEstimateContractGas';

export enum ApproveState {
  UNKNOWN,
  NOW_APPROVE,
  PENDING,
  APPROVE
}

interface useApproveCallBackProps {
  token: Currency | Hash;
  amountToApprove: bigint;
  spender?: Hash;
  onFail?: () => void;
  // approveBaseAmount?: bigint;
}

interface tokenAllowanceProps {
  token: Hash;
  account: Hash;
  spender: Hash;
}

export const useTokenAllowance = <T>({
  token,
  account,
  spender
}: tokenAllowanceProps): T => {
  const data = useSingleCallResult({
    address: token,
    functionName: 'allowance',
    abi: ERC20,
    args: [account, spender]
    // options: NEVER_RELOAD
  });

  return data?.result as T;
};
export const useHasPendingApproval = ({
  token,
  spender
}: Pick<tokenAllowanceProps, 'token' | 'spender'>) => {
  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      (Object.keys(allTransactions) as Hash[]).some((hash: Hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          return (
            tx.approval?.tokenAddress === token &&
            tx.approval?.spender === spender
          );
        }
      }),
    [allTransactions, token, spender]
  );
};

export const useApproveCallBack = ({
  token,
  amountToApprove,
  spender
}: useApproveCallBackProps): {
  approvalState: ApproveState;
  approveCallback: () => Promise<TransactionReceipt | undefined>;
} => {
  const account = useAccount();

  const approveParams = useMemo<WriteContractParameters>(
    () =>
      ({
        address: token as Hash,
        account: account.address as Hash,
        functionName: 'approve' as ExtractAbiFunctionNames<typeof ERC20>,
        abi: ERC20,
        args: [spender as Hash, MAX_UNIT256]
      } as const),
    [token, account.address, spender]
  );

  const estimatedGas = useEstimateContractGas(approveParams);
  const currentAllowance = useTokenAllowance<bigint>({
    token: token as Hash,
    account: account.address as Hash,
    spender: spender as Hash
  });

  // const addTransaction = useTransactionAdder();

  const pendingApproval = useHasPendingApproval({
    token: token as Hash,
    spender: spender as Hash
  });

  const ETHER = useWNATIVE();

  const approvalState = useMemo(() => {
    if (!spender) {
      return ApproveState.UNKNOWN;
    }

    if (token === ETHER) return ApproveState.APPROVE;
    if (currentAllowance === undefined) return ApproveState.UNKNOWN;

    return BigInt(currentAllowance) < amountToApprove
      ? pendingApproval
        ? ApproveState.PENDING
        : ApproveState.NOW_APPROVE
      : ApproveState.APPROVE;
  }, [
    token,
    spender,
    ETHER,
    currentAllowance,
    amountToApprove,
    pendingApproval
  ]);

  const approve = useCallback(async (): Promise<
    TransactionReceipt | undefined
  > => {
    if (
      approvalState !== ApproveState.NOW_APPROVE ||
      !token ||
      !spender ||
      !amountToApprove
    )
      return undefined;
    const hash = await writeContract(config, {
      ...approveParams,
      gas: estimatedGas
    } as any);

    // addTransaction({
    //   hash,
    //   payload: {
    //     summary: 'Approved',
    //     approval: {
    //       tokenAddress: token as Hash,
    //       spender: spender as Hash
    //     }
    //   }
    // });
    return await waitForTransactionReceipt(config, {
      hash
    });
  }, [
    approvalState,
    token,
    spender,
    amountToApprove,
    approveParams,
    estimatedGas
    // addTransaction
  ]);

  return {
    approvalState,
    approveCallback: approve
  };
};
