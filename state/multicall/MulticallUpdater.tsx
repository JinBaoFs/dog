import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicClient } from 'viem';
import { useBlockNumber, useAccount, usePublicClient } from 'wagmi';
import { Hash } from 'viem';
import { CancelledError, retry } from '@/lib/retry';
import MULTICALL_ABI from '@/constants/abi/multicall';
import { useVisible } from '@/hooks/useVisible';
import useDebounce from '../../hooks/useDebounce';
import { AppDispatch, AppState } from '../index';
import {
  Call,
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  parseCallKey,
  updateMulticallResults
} from './actions';

// chunk calls so we do not exceed the gas limit
const CALL_CHUNK_SIZE = 500;

export function chunkArray<T>(items: T[], maxChunkSize: number): T[][] {
  if (maxChunkSize < 1) throw new Error('maxChunkSize must be gte 1');
  if (items.length <= maxChunkSize) return [items];

  const numChunks: number = Math.ceil(items.length / maxChunkSize);
  const chunkSize = Math.ceil(items.length / numChunks);

  return [...Array(numChunks).keys()].map(ix =>
    items.slice(ix * chunkSize, ix * chunkSize + chunkSize)
  );
}
async function fetchChunk(
  publicClient: PublicClient,
  chunk: Call[]
): Promise<{ results: readonly Hash[]; blockNumber: number }> {
  let resultsBlockNumber, returnData;
  try {
    [resultsBlockNumber, returnData] = await publicClient.readContract({
      address: publicClient.chain?.contracts?.multicall3?.address as Hash,
      functionName: 'aggregate',
      abi: MULTICALL_ABI,
      args: [chunk.map((call: Call) => [call.address, call.callData])] as any
    });
  } catch (error) {
    console.debug('Failed to fetch chunk inside retry', error);
    throw error;
  }
  return { results: returnData, blockNumber: Number(resultsBlockNumber) };
}

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(
  allListeners: AppState['multicall']['callListeners'],
  chainId?: number
): { [callKey: string]: number } {
  if (!allListeners || !chainId) return {};
  const listeners = allListeners[chainId];
  if (!listeners) return {};

  return Object.keys(listeners).reduce<{ [callKey: string]: number }>(
    (memo, callKey) => {
      const keyListeners = listeners[callKey];

      memo[callKey] = Object.keys(keyListeners)
        .filter(key => {
          const blocksPerFetch = parseInt(key);
          if (blocksPerFetch <= 0) return false;
          return keyListeners[blocksPerFetch] > 0;
        })
        .reduce((previousMin, current) => {
          return Math.min(previousMin, parseInt(current));
        }, Infinity);
      return memo;
    },
    {}
  );
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export function outdatedListeningKeys(
  callResults: AppState['multicall']['callResults'],
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  latestBlockNumber: number | undefined
): string[] {
  if (!chainId || !latestBlockNumber) return [];
  const results = callResults[chainId];

  if (!results) return Object.keys(listeningKeys);

  return Object.keys(listeningKeys).filter(callKey => {
    const blocksPerFetch = listeningKeys[callKey];

    const data = callResults[chainId][callKey];

    if (!data) return true;

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1);

    if (
      data.fetchingBlockNumber &&
      data.fetchingBlockNumber >= minDataBlockNumber
    )
      return false;

    return !data.blockNumber || data.blockNumber < minDataBlockNumber;
  });
}

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector<AppState, AppState['multicall']>(
    state => state.multicall
  );
  const visible = useVisible();
  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100);
  const { data: latestBlockNumber } = useBlockNumber({
    watch: visible
  });
  const { chain } = useAccount();
  const publicClient = usePublicClient();
  const cancellations = useRef<{
    blockNumber: number;
    cancellations: (() => void)[];
  }>();

  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chain?.id);
  }, [debouncedListeners, chain?.id]);

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(
      state.callResults,
      listeningKeys,
      chain?.id,
      Number(latestBlockNumber)
    );
  }, [chain?.id, state.callResults, listeningKeys, latestBlockNumber]);

  const serializedOutdatedCallKeys = useMemo(
    () => JSON.stringify(unserializedOutdatedCallKeys.sort()),
    [unserializedOutdatedCallKeys]
  );
  useEffect(() => {
    if (!Number(latestBlockNumber) || !chain?.id || !publicClient || !visible)
      return;

    const outdatedCallKeys: Hash[] = JSON.parse(serializedOutdatedCallKeys);

    if (outdatedCallKeys.length === 0) return;
    const calls = outdatedCallKeys.map(key => parseCallKey(key));

    const chunkedCalls = chunkArray(calls, CALL_CHUNK_SIZE);

    if (cancellations.current?.blockNumber !== Number(latestBlockNumber)) {
      cancellations.current?.cancellations?.forEach(c => c());
    }

    dispatch(
      fetchingMulticallResults({
        calls,
        chainId: chain?.id,
        fetchingBlockNumber: Number(latestBlockNumber)
      })
    );

    cancellations.current = {
      blockNumber: Number(latestBlockNumber),
      cancellations: chunkedCalls.map((chunk, index) => {
        const { cancel, promise } = retry(
          () => fetchChunk(publicClient, chunk),
          {
            n: Infinity,
            minWait: 2500,
            maxWait: 3500
          }
        );
        promise
          .then(({ results: returnData, blockNumber: fetchBlockNumber }) => {
            cancellations.current = {
              cancellations: [],
              blockNumber: Number(latestBlockNumber)
            };

            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls
              .slice(0, index)
              .reduce<number>((memo, curr) => memo + curr.length, 0);
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length;

            dispatch(
              updateMulticallResults({
                chainId: chain.id,
                results: outdatedCallKeys
                  .slice(firstCallKeyIndex, lastCallKeyIndex)
                  .reduce<{ [callKey: string]: Hash }>((memo, callKey, i) => {
                    memo[callKey] = returnData[i] ?? '';
                    return memo;
                  }, {}),
                blockNumber: fetchBlockNumber
              })
            );
          })
          .catch((error: any) => {
            if (error instanceof CancelledError) {
              console.debug(
                'Cancelled fetch for blockNumber',
                Number(latestBlockNumber)
              );
              return;
            }
            console.error(
              'Failed to fetch multicall chunk',
              chunk,
              chain?.id,
              error
            );
            dispatch(
              errorFetchingMulticallResults({
                calls: chunk,
                chainId: chain.id,
                fetchingBlockNumber: Number(latestBlockNumber)
              })
            );
          });
        return cancel;
      })
    };
  }, [
    chain?.id,
    publicClient,
    dispatch,
    visible,
    serializedOutdatedCallKeys,
    latestBlockNumber
  ]);

  return null;
}
