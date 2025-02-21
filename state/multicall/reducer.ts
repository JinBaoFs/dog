import { createReducer } from '@reduxjs/toolkit';
import { Hash } from 'viem';
import {
  addMulticallListener,
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  removeMulticallListener,
  toCallKey,
  updateMulticallResults
} from './actions';

type CallKeyType = {
  [blocksPerFetch: number]: number;
};
export interface MulticallState {
  callListeners?: {
    [chainId: number]: {
      [callkey: string]: CallKeyType;
    };
  };

  callResults: {
    [chainId: number]: {
      [callkey: string]: {
        data?: Hash;
        blockNumber?: number;
        fetchingBlockNumber?: number;
      };
    };
  };
}

const initialState: MulticallState = {
  callResults: {}
};

const multicalStore = createReducer(initialState, builder =>
  builder
    .addCase(
      addMulticallListener,
      (
        state,
        { payload: { chainId, calls, options: { blocksPerFetch = 1 } = {} } }
      ) => {
        const listeners: MulticallState['callListeners'] = state.callListeners
          ? state.callListeners
          : (state.callListeners = {});

        listeners[chainId] = listeners[chainId] ?? {};
        calls.forEach(call => {
          const callKey = toCallKey(call);
          listeners[chainId][callKey] = listeners[chainId][callKey] ?? {};
          listeners[chainId][callKey] = {
            [blocksPerFetch]:
              (listeners[chainId][callKey][blocksPerFetch] ?? 0) + 1,
            ...call
          };
          state.callListeners = listeners;
        });
      }
    )
    .addCase(
      removeMulticallListener,
      (
        state,
        { payload: { chainId, calls, options: { blocksPerFetch = 1 } = {} } }
      ) => {
        const listener: MulticallState['callListeners'] = state.callListeners
          ? state.callListeners
          : (state.callListeners = {});
        if (!listener[chainId]) return;

        calls.forEach(call => {
          const callKey = toCallKey(call);
          if (!listener[chainId][callKey]) return;
          if (!listener[chainId][callKey][blocksPerFetch]) return;

          if (listener[chainId][callKey][blocksPerFetch] === 1) {
            delete listener[chainId][callKey][blocksPerFetch];
          } else {
            listener[chainId][callKey][blocksPerFetch]--;
          }
        });
      }
    )
    .addCase(
      fetchingMulticallResults,
      (state, { payload: { chainId, calls, fetchingBlockNumber } }) => {
        state.callResults[chainId] = state.callResults[chainId] ?? {};
        calls.forEach(call => {
          const callKey = toCallKey(call);
          const _current = state.callResults[chainId][callKey];
          if (!_current) {
            state.callResults[chainId][callKey] = {
              fetchingBlockNumber
            };
          } else {
            if ((_current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber)
              return;
            state.callResults[chainId][callKey].fetchingBlockNumber =
              fetchingBlockNumber;
          }
        });
      }
    )
    .addCase(
      errorFetchingMulticallResults,
      (state, { payload: { chainId, calls, fetchingBlockNumber } }) => {
        state.callResults = state.callResults ?? {};
        calls.forEach(call => {
          const callKey = toCallKey(call);
          const current = state.callResults[chainId][callKey];
          if (!current) return;
          if (current.fetchingBlockNumber === fetchingBlockNumber) {
            delete current.fetchingBlockNumber;
            current.data = undefined;
            current.blockNumber = fetchingBlockNumber;
          }
        });
      }
    )
    .addCase(
      updateMulticallResults,
      (state, { payload: { results, chainId, blockNumber } }) => {
        state.callResults = state.callResults ?? {};
        Object.keys(results).forEach(callKey => {
          const current = state.callResults[chainId][callKey];
          if ((current.blockNumber ?? 0) >= blockNumber) return;
          state.callResults[chainId][callKey] = {
            data: results[callKey],
            blockNumber
          };
        });
      }
    )
);

export default multicalStore;
