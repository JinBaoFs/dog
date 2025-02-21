import { createAction } from '@reduxjs/toolkit';
import { Hash } from 'viem';

export interface SerializableTransactionReceipt {
  to: Hash | null;
  from: Hash;
  contractAddress: Hash | null;
  transactionIndex: number;
  blockHash: string;
  transactionHash: Hash;
  blockNumber: number;
  status?: boolean;
}

export const addTransaction = createAction<{
  chainId: number;
  hash: Hash;
  from: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
}>('transactions/addTransaction');

export const clearAllTransactions = createAction<{ chainId: number }>(
  'transactions/clearAllTransactions'
);

export const checkedTransaction = createAction<{
  chainId: number;
  hash: Hash;
  blockNumber: number;
}>('transactions/checkedTransaction');

export const finalizeTransaction = createAction<{
  chainId: number;
  hash: Hash;
  receipt: SerializableTransactionReceipt;
}>('transactions/finishTransaction');
