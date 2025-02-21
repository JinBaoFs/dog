import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { useCallback } from 'react';
import { Hash } from 'viem';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { AppDispatch, AppState } from '..';
import { addTransaction } from './actions';
import { TransactionDetails } from './reducer';

interface useTransitionAdderProps {
  hash: Hash;
  payload?: {
    summary?: string;
    approval?: { tokenAddress: string; spender: string };
  };
}
export const useTransactionAdder: () => ({
  hash,
  payload
}: useTransitionAdderProps) => void = () => {
  const { chain, address } = useAccount();
  const allTransaction = useAllTransactions();
  const addRecentTransaction = useAddRecentTransaction();
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ hash, payload }) => {
      if (!address || !chain?.id) return;
      if (!hash) throw Error('No transaction hash found.');
      if (allTransaction?.[hash]) {
        throw Error('Attempted to add existing transaction.');
      }
      dispatch(
        addTransaction({
          hash,
          from: address,
          chainId: chain.id,
          ...payload
        })
      );
      addRecentTransaction({
        hash,
        description: payload?.summary || ''
      });
    },
    [allTransaction, addRecentTransaction, dispatch, address, chain]
  );
};

export const useAllTransactions = (): {
  [txHash: Hash]: TransactionDetails;
} => {
  const { chain } = useAccount();
  const state = useSelector<AppState, AppState['transactions']>(
    state => state.transactions
  );
  return chain?.id ? state[chain?.id] ?? {} : {};
};

export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}
