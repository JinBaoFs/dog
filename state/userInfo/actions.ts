import { createAction } from '@reduxjs/toolkit';
import { TXStatus } from '@/types/global';

export const userSignIn = createAction<{
  userInfo: any;
  token?: string;
}>('userInfo/signIn');

export const userSignOut = createAction('userInfo/SignOut');

export const updateIPStatus = createAction<{
  isDisabled: boolean;
}>('userInfo/updateIPStatus');

export const updateTxModalStatus = createAction<{
  status: TXStatus | null;
}>('userInfo/updateTxModalStatus');

export const updateBindModalStatus = createAction<{
  bindModalStatus: boolean;
}>('userInfo/updateBindModalStatus');
