import { createAction } from '@reduxjs/toolkit';
import { Hash } from 'viem';
import { ChainId } from '@/constants';

export interface ListenerOptions {
  readonly blocksPerFetch?: number;
}

export interface Call {
  address: Hash;
  callData?: Hash;
}

export interface ListenerOptions {
  readonly blocksPerFetch?: number;
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
// const LOWER_HEX_REGEX = /^0x[a-f0-9]8$/;

export const toCallKey = ({ address, callData }: Call) => {
  if (!ADDRESS_REGEX.test(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return `${address}-${callData}`;
};

export const parseCallKey = (
  key: string
): {
  address: Hash;
  callData: Hash;
} => {
  const [address, callData] = key.split('-');
  return { address: address as Hash, callData: callData as Hash };
};

export const addMulticallListener = createAction<{
  chainId: ChainId;
  calls: Call[];
  options?: ListenerOptions;
}>('multicall/addMulticallListener');

export const removeMulticallListener = createAction<{
  chainId: ChainId;
  calls: Call[];
  options?: ListenerOptions;
}>('multicall/removeMulticallListener');

export const updateMulticallResults = createAction<{
  chainId: ChainId;
  blockNumber: number;
  results: {
    [callKey: string]: Hash;
  };
}>('multicall/updateMulticallResults');

export const fetchingMulticallResults = createAction<{
  chainId: ChainId;
  calls: Call[];
  fetchingBlockNumber: number;
}>('multicall/fetchMulticallListeners');

export const errorFetchingMulticallResults = createAction<{
  chainId: ChainId;
  calls: Call[];
  fetchingBlockNumber: number;
}>('multicall/errorFetchingMulticallResults');
