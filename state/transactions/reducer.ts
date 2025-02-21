import { createReducer } from '@reduxjs/toolkit';
import { Hash } from 'viem';

import {
  SerializableTransactionReceipt,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction
} from './actions';
import { addTransaction } from './actions';

export interface TransactionDetails {
  hash: Hash;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
}

const now = () => new Date().getTime();

export interface TransactionState {
  [chainId: number]: {
    [txHash: Hash]: TransactionDetails;
  };
}

const initialState: TransactionState = {
  97: {}
};

export default createReducer(initialState, builder =>
  builder
    .addCase(
      addTransaction,
      (state, { payload: { chainId, from, hash, approval, summary } }) => {
        const txs = state[chainId] ?? {};
        txs[hash] = { hash, from, approval, summary, addedTime: now() };

        state[chainId] = txs;
      }
    )
    .addCase(clearAllTransactions, (state, { payload: { chainId } }) => {
      if (!state[chainId]) return;
      state[chainId] = {};
    })
    .addCase(
      checkedTransaction,
      (state, { payload: { chainId, hash, blockNumber } }) => {
        const tx = state[chainId]?.[hash];
        if (!tx) return;
        tx.lastCheckedBlockNumber = !tx.lastCheckedBlockNumber
          ? blockNumber
          : Math.max(blockNumber, tx.lastCheckedBlockNumber);
      }
    )
    .addCase(
      finalizeTransaction,
      (state, { payload: { chainId, hash, receipt } }) => {
        const tx = state[chainId]?.[hash];
        if (!tx) return;
        tx.receipt = receipt;
        tx.confirmedTime = now();
      }
    )
);
