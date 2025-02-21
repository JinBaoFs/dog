import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { signOut, signIn } from 'next-auth/react';
import { TXStatus, UserInfoType } from '@/types/global';
import { AppState, AppDispatch } from '..';
import {
  userSignIn,
  updateIPStatus,
  userSignOut,
  updateTxModalStatus,
  updateBindModalStatus
} from './actions';

export const useUserInfo = () => {
  return useSelector((state: AppState) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userInfo } = state.userInfo;
    return userInfo;
  });
};

export const useUserToken = () => {
  return useSelector((state: AppState) => {
    return state.userInfo.token;
  });
};

export const useTxModalStatus = () => {
  return useSelector((state: AppState) => {
    return state.userInfo.txModalStatus;
  });
};

export const useUpdateTxModalStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ status }: { status: TXStatus | null }) => {
      dispatch(
        updateTxModalStatus({
          status
        })
      );
    },
    [dispatch]
  );
};

export const useBindModalStatus = () => {
  return useSelector((state: AppState) => {
    return state.userInfo.bindModalStatus;
  });
};

export const useUpdateBindModalStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ bindModalStatus }: { bindModalStatus: boolean }) => {
      dispatch(
        updateBindModalStatus({
          bindModalStatus
        })
      );
    },
    [dispatch]
  );
};

export const useUserSignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ userInfo, token }: { userInfo: UserInfoType; token: string }) => {
      dispatch(
        userSignIn({
          userInfo,
          token
        })
      );
      signIn('credentials', {
        token,
        address: userInfo.address,
        redirect: false
        // callbackUrl: process.env.NEXT_PUBLIC_CALLBACKURL_URL
      });
    },
    [dispatch]
  );
};

export const useUpdateInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ userInfo }: { userInfo: UserInfoType }) => {
      dispatch(
        userSignIn({
          userInfo
        })
      );
    },
    [dispatch]
  );
};

export const useUserSignOut = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => {
    dispatch(userSignOut());
    signOut({
      redirect: false
    });
  }, [dispatch]);
};

export const useIPStatus = () => {
  return useSelector((state: AppState) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDisabled } = state.userInfo;
    return isDisabled;
  });
};

export const useUpdateIPStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    ({ isDisabled }: { isDisabled: boolean }) => {
      dispatch(
        updateIPStatus({
          isDisabled
        })
      );
    },
    [dispatch]
  );
};

export const useCheckSpreadName = () => {
  const userInfo = useUserInfo();
  const updateBindStatux = useUpdateBindModalStatus();
  return useCallback(() => {
    if (!userInfo?.spread_name) {
      updateBindStatux({ bindModalStatus: true });
      throw '';
    }
  }, [userInfo, updateBindStatux]);
};
