import { useSelector, useDispatch } from 'react-redux';
import { useAccount } from 'wagmi';
import { useCallback, useMemo } from 'react';
import { Hash } from 'viem';
import { AppState, AppDispatch } from '..';
import { PopupContent, addPopup, removePopup } from './actions';

export const useBlockNumber = () => {
  const { chain } = useAccount();
  return useSelector(
    (state: AppState) => state.application.blockNumber[chain?.id || 97]
  );
};

export const useAddPopup = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ key, content }: { key?: Hash; content: PopupContent }) => {
      dispatch(addPopup({ key, content }));
    },
    [dispatch]
  );
};

export const useRemovePopup = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ key }: { key?: Hash }) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
};

export const useActivePopup = (): AppState['application']['popupList'] => {
  const list = useSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter(item => item.show), [list]);
};
