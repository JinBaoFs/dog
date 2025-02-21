import { createAction } from '@reduxjs/toolkit';
import { Hash } from 'viem';

export type PopupContent =
  | {
      txn: {
        hash: string;
        success: boolean;
        summary?: string;
      };
    }
  | {
      listUpdate: {
        listUrl: string;
        auto: boolean;
      };
    };

export const updateBlockNumber = createAction<{
  chainId: number;
  blockNumber: number;
}>('application/updateBlockNumber');

export const addPopup = createAction<{
  key?: Hash;
  removeAfterMs?: number | null;
  content: PopupContent;
}>('application/addPopup');

export const removePopup = createAction<{ key?: Hash }>(
  'application/removePopup'
);
