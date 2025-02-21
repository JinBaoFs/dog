import { createReducer } from '@reduxjs/toolkit';
import { UserInfoType } from '@/types/global';
import { TXStatus } from './../../types/global';
import {
  userSignIn,
  userSignOut,
  updateIPStatus,
  updateTxModalStatus,
  updateBindModalStatus
} from './actions';

const initialState: {
  userInfo: UserInfoType | null;
  token: string;
  isDisabled?: boolean;
  txModalStatus: TXStatus | null;
  bindModalStatus: boolean;
} = {
  userInfo: null,
  token: '',
  txModalStatus: null,
  bindModalStatus: false
};

export default createReducer(initialState, builder =>
  builder
    .addCase(userSignIn, (state, { payload }) => {
      state.userInfo = payload.userInfo;
      if (payload.token) state.token = payload.token;
    })
    .addCase(userSignOut, state => {
      state.userInfo = null;
      state.token = '';
    })
    .addCase(updateIPStatus, (state, { payload }) => {
      state.isDisabled = payload.isDisabled;
    })
    .addCase(updateTxModalStatus, (state, { payload }) => {
      state.txModalStatus = payload.status;
    })
    .addCase(updateBindModalStatus, (state, { payload }) => {
      state.bindModalStatus = payload.bindModalStatus;
    })
);
