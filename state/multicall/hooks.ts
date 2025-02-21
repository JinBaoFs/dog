import {
  Hash,
  decodeFunctionResult,
  encodeFunctionData,
  EncodeFunctionDataParameters,
  DecodeFunctionResultParameters,
  isAddress
} from 'viem';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useBlockNumber, useAccount, usePublicClient } from 'wagmi';
import {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames
} from 'abitype';
import MULTICALL_ABI from '@/constants/abi/multicall';
import { AppDispatch, AppState } from '..';
import {
  ListenerOptions,
  addMulticallListener,
  removeMulticallListener,
  toCallKey,
  Call
} from './actions';

interface CallResult {
  readonly valid: boolean;
  readonly data: Hash | undefined;
  readonly blockNumber: number | undefined;
}

const INVALID_RESULT: CallResult = {
  valid: false,
  blockNumber: undefined,
  data: undefined
};

export const NEVER_RELOAD = {
  blocksPerFetch: Infinity
};

type ExtractAbiFunctionNamesType<T extends Abi> = ExtractAbiFunctionNames<
  T,
  'pure' | 'view'
>;

type parametersFucntionArgs<
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<T, TFunctionName>['inputs'],
  'inputs'
>;

type CallResultResultType<T> = CallState<T | undefined>;

type useCallResultResultType<
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>,
  TAbiFunction extends AbiFunction = ExtractAbiFunction<T, TFunctionName>
> = AbiParametersToPrimitiveTypes<TAbiFunction['outputs'], 'outputs'>;

type useCallParamsType<T extends Abi> = {
  functionName: ExtractAbiFunctionNames<T>;
  abi: T;
  options?: ListenerOptions;
};

type useSingleContractMultipleDataProps<
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>
> = {
  address: Hash;
  args: parametersFucntionArgs<T, TFunctionName>[];
} & useCallParamsType<T>;

type useSingleCallResultProps<
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>
> = {
  address: Hash;
  args: parametersFucntionArgs<T, TFunctionName>;
} & useCallParamsType<T>;

type useMultipleContractSingleDataProps<
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>
> = {
  addresses: Hash[];
  args: parametersFucntionArgs<T, TFunctionName>;
} & useCallParamsType<T>;

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}
interface CallState<T> {
  readonly valid: boolean;
  readonly result: T | undefined;
  readonly loading: boolean;
  readonly syncing: boolean;
  readonly error: boolean;
}

const INVALID_CALL_STATE: CallState<undefined> = {
  valid: false,
  result: undefined,
  loading: false,
  syncing: false,
  error: false
};
const LOADING_CALL_STATE: CallState<undefined> = {
  valid: true,
  result: undefined,
  loading: true,
  syncing: true,
  error: false
};

const toCallState = <
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>,
  ToCallStateResult
>(
  callResult: CallResult | undefined,
  latestBlockNumber: bigint | undefined,
  contractArgs: {
    functionName: string;
    abi: Abi;
    args: parametersFucntionArgs<T, TFunctionName>;
  }
): CallState<ToCallStateResult | undefined> => {
  if (!callResult) return INVALID_CALL_STATE;
  const { valid, data, blockNumber } = callResult;
  if (!valid) return INVALID_CALL_STATE;
  if (valid && !blockNumber) return LOADING_CALL_STATE;
  if (!latestBlockNumber) return LOADING_CALL_STATE;
  const success = data && data.length > 2;
  const syncing = (blockNumber ?? 0) < latestBlockNumber;
  let result: ToCallStateResult | undefined = undefined;
  if (success && data) {
    try {
      result = decodeFunctionResult({
        ...contractArgs,
        data
      } as DecodeFunctionResultParameters) as ToCallStateResult;
    } catch (error) {
      return {
        ...LOADING_CALL_STATE,
        syncing,
        result
      } as CallResultResultType<ToCallStateResult>;
    }
  }
  return {
    valid: true,
    loading: false,
    syncing,
    result: result,
    error: !success
  };
};

export const useCallsData = (
  calls: Call[],
  options?: ListenerOptions
): CallResult[] => {
  const dispatch = useDispatch<AppDispatch>();
  const { chain } = useAccount();
  const callResults = useSelector<
    AppState,
    AppState['multicall']['callResults']
  >(state => state.multicall.callResults);
  useEffect(() => {
    if (!chain?.id) return;
    dispatch(
      addMulticallListener({
        chainId: chain.id,
        calls,
        options
      })
    );

    return () => {
      dispatch(removeMulticallListener({ chainId: chain.id, calls, options }));
    };
  }, [dispatch, calls, chain, options]);
  return useMemo(() => {
    return calls.map((call: Call) => {
      if (
        !chain?.id ||
        !call ||
        !callResults[chain.id] ||
        !callResults[chain.id][toCallKey(call)]
      )
        return INVALID_RESULT;
      const result = callResults[chain.id][toCallKey(call)];
      return {
        valid: true,
        data: result.data,
        blockNumber: result?.blockNumber
      };
    });
  }, [calls, callResults, chain]);
};

export const useSingleCallResult = <
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>,
  TAbiFunction extends AbiFunction = ExtractAbiFunction<T, TFunctionName>,
  useSingleCallResultData = useCallResultResultType<
    T,
    TFunctionName,
    TAbiFunction
  >
>({
  address,
  options,
  ...otherParams
}: useSingleCallResultProps<
  T,
  TFunctionName
>): CallResultResultType<useSingleCallResultData> => {
  const { data: latestBlockNumber } = useBlockNumber();

  const results = useCallsData(
    (otherParams.args.length &&
      (otherParams.args as any[]).some((item: any) => item === undefined)) ||
      !isAddress(address)
      ? []
      : [
          {
            address,
            callData: encodeFunctionData(
              otherParams as EncodeFunctionDataParameters
            )
          }
        ],
    options
  );

  return useMemo(
    () =>
      results.map((result: CallResult) => {
        const data = toCallState<T, TFunctionName, useSingleCallResultData>(
          result,
          latestBlockNumber,
          otherParams
        );
        return data;
      })[0],
    [results, otherParams, latestBlockNumber]
  );
};

export const useSingleContractMultipleData = <
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>,
  TAbiFunction extends AbiFunction = ExtractAbiFunction<T, TFunctionName>,
  useSingleContractMultipleDataResult = useCallResultResultType<
    T,
    TFunctionName,
    TAbiFunction
  >
>({
  address,
  options,
  args,
  ...otherParams
}: useSingleContractMultipleDataProps<
  T,
  TFunctionName
>): CallResultResultType<useSingleContractMultipleDataResult>[] => {
  const { data: latestBlockNumber } = useBlockNumber();
  const calls: Call[] = useMemo(() => {
    if (!address) return [];
    if (
      args.length &&
      (args as any[]).some((item: any) => item.includes(undefined))
    ) {
      return [];
    }
    return args.map(account => {
      return {
        address,
        callData: encodeFunctionData({
          ...otherParams,
          args: account
        } as EncodeFunctionDataParameters)
      };
    });
  }, [args, address, otherParams]);

  const results = useCallsData(calls, options);

  return useMemo(
    () =>
      results.map(result => {
        const data = toCallState<
          T,
          TFunctionName,
          useSingleContractMultipleDataResult
        >(result, latestBlockNumber, {
          ...otherParams,
          args: (args.map(i => i[0]) || []) as AbiParametersToPrimitiveTypes<
            ExtractAbiFunction<T, TFunctionName>['inputs'],
            'inputs'
          >
        });
        return data;
      }),
    [results, otherParams, args, latestBlockNumber]
  );
};

export const useMultipleContractSingleData = <
  T extends Abi,
  TFunctionName extends ExtractAbiFunctionNamesType<T>,
  TAbiFunction extends AbiFunction = ExtractAbiFunction<T, TFunctionName>,
  useMultipleContractSingleDataResult = useCallResultResultType<
    T,
    TFunctionName,
    TAbiFunction
  >
>({
  addresses,
  options,
  ...otherParams
}: useMultipleContractSingleDataProps<
  T,
  TFunctionName
>): CallResultResultType<useMultipleContractSingleDataResult>[] => {
  const { data: latestBlockNumber } = useBlockNumber();
  const calls: Call[] = useMemo(() => {
    if (
      otherParams.args.length &&
      (otherParams.args as any[]).some((item: any) => item === undefined)
    )
      return [];
    return addresses
      .filter(item => isAddress(item))
      .map((address: Hash) => {
        return {
          address: address,
          callData: encodeFunctionData(
            otherParams as EncodeFunctionDataParameters
          )
        };
      });
  }, [addresses, otherParams]);

  const results = useCallsData(calls, options);
  return useMemo(
    () =>
      results.map(result => {
        const data = toCallState<
          T,
          TFunctionName,
          useMultipleContractSingleDataResult
        >(result, latestBlockNumber, otherParams);
        return data;
      }),
    [results, otherParams, latestBlockNumber]
  );
};

export const useETHBalances = (address: Hash[]) => {
  const publicClient = usePublicClient();
  return useSingleContractMultipleData({
    abi: MULTICALL_ABI,
    address: publicClient?.chain?.contracts?.multicall3?.address as Hash,
    args: address.map(hash => [hash] as [Hash]),
    functionName: 'getEthBalance'
  });
};
