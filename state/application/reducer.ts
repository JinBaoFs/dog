import { createReducer, nanoid } from '@reduxjs/toolkit';
import { Hash } from 'viem';
import { addPopup, removePopup, updateBlockNumber } from './actions';
import { PopupContent } from './actions';

export type PopupList = Array<{
  key: Hash;
  show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
}>;

export interface ApplicationState {
  blockNumber: { [chainId: number]: number };
  popupList: PopupList;
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: []
};

export default createReducer(initialState, builder =>
  builder
    .addCase(
      updateBlockNumber,
      (state, { payload: { chainId, blockNumber } }) => {
        state.blockNumber[chainId] =
          typeof state.blockNumber[chainId] !== 'number'
            ? blockNumber
            : Math.max(blockNumber, state.blockNumber[chainId]);
      }
    )
    .addCase(
      addPopup,
      (state, { payload: { key, content, removeAfterMs = 15000 } }) => {
        state.popupList = (
          key ? state.popupList.filter(popup => popup.key !== key) : []
        ).concat([
          {
            key: key || (nanoid() as Hash),
            show: true,
            content,
            removeAfterMs
          }
        ]);
      }
    )
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach(popup => {
        if (popup.key === key) {
          popup.show = false;
        }
      });
    })
);
