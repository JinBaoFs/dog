'use client';

import {
  Box,
  useDisclosure,
  Button,
  useBoolean,
  Input,
  useToast
} from '@chakra-ui/react';
import { SiweMessage } from 'siwe';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useAccountEffect, useSignMessage } from 'wagmi';
import { Hash, isAddress, isAddressEqual } from 'viem';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { ajaxGet, ajaxPost } from '@/api/axios';
import {
  useUserSignIn,
  useUserInfo,
  useUserSignOut,
  useUpdateInfo,
  useBindModalStatus,
  useUpdateBindModalStatus
} from '@/state/userInfo/hook';
import { axiosUrlType } from '@/api/type';
import { UserInfoType } from '@/types/global';
import Modal from '../Modal';

const SignMessageStr = 'Welcome to DIALECT WORLD';

const AuthModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBindOpen,
    onOpen: onBindOpen,
    onClose: onBindClose
  } = useDisclosure();
  const [flag, setFlag] = useBoolean();

  const userInfo = useUserInfo();
  const signOut = useUserSignOut();
  const { signMessageAsync } = useSignMessage();
  const { address, chainId } = useAccount();
  const userSignIn = useUserSignIn();
  const updateInfo = useUpdateInfo();
  const bindModalStatus = useBindModalStatus();
  const updateBindStatux = useUpdateBindModalStatus();
  const toast = useToast();
  const searchParams = useSearchParams();
  const { data } = useSWR<UserInfoType>(
    userInfo ? 'getUserInfo' : '',
    (url: any) => ajaxGet(url as axiosUrlType),
    {
      refreshInterval: 4000
    }
  );
  const t = useTranslations('Common');
  useEffect(() => {
    data &&
      updateInfo({
        userInfo: data
      });
  }, [updateInfo, data]);

  useEffect(() => {
    if (!data) return;
    if (!data.spread_name || bindModalStatus) {
      onBindOpen();
    }
  }, [data, onBindOpen, bindModalStatus]);

  const invateCode = useMemo(() => {
    if (typeof localStorage === 'undefined') return '';
    return searchParams.get('invateCode')
      ? searchParams.get('invateCode')
      : localStorage
      ? localStorage.getItem('invateCode')
      : '';
  }, [searchParams]);

  const [account, setAccount] = useState<Hash>(invateCode as Hash);

  const signIn = useCallback(async () => {
    try {
      const nonce = Math.random().toString(36).substring(2); // 随机 nonce

      const messageData = new SiweMessage({
        domain: location.origin,
        address: address as string,
        statement: SignMessageStr,
        uri: location.origin,
        version: '1',
        chainId: chainId,
        nonce
      });
      console.log(messageData.prepareMessage());
      setFlag.on();
      const sign = await signMessageAsync({
        message: SignMessageStr || messageData.prepareMessage()
      });
      console.log(sign);

      // const res = await messageData.verify({
      //   signature: sign || '0x077f4c4a6602b1b84e881951401d75bf0302424b78f0105856405f80f67e9fcb74355ad04cd5e0b5b282d897c28a227bcc896a92c51fc9d60a2bdcb30bc010a81b'
      // });
      // console.log(res);

      const {
        status,
        data: { user, token }
      } = (await ajaxPost('login', {
        sign,
        address,
        message: SignMessageStr,
        invite_code: invateCode,
        nonce,
        issuedAt: messageData.issuedAt
      })) as any;
      setFlag.off();
      onClose();
      if (status === 200) {
        if (!user.p_id) {
          onBindOpen();
        }
        userSignIn({
          userInfo: user,
          token
        });
      }
    } catch (error) {
      console.log(error);

      setFlag.off();
    }
  }, [
    chainId,
    signMessageAsync,
    onBindOpen,
    onClose,
    invateCode,
    userSignIn,
    address,
    setFlag
  ]);

  const bindAddress = useCallback(async () => {
    try {
      setFlag.on();

      const { status, message } = (await ajaxPost('spread', {
        address: account
      })) as any;
      setFlag.off();

      if (status !== 200) {
        toast({
          status: 'error',
          title: message
        });
        return;
      }
      toast({
        status: 'success',
        title: t('Successfully bound')
      });
      await updateBindStatux({ bindModalStatus: false });
      onBindClose();
    } catch (error) {
      setFlag.off();
    }
  }, [onBindClose, t, toast, account, setFlag, updateBindStatux]);

  const btnStatus = useMemo(() => {
    if (!account) {
      return {
        isDisabled: true,
        text: t('Confirm')
      };
    }
    if ((account && !isAddress(account)) || account === address) {
      return {
        isDisabled: true,
        text: t('Invalid Address')
      };
    }
    return {
      isDisabled: false,
      text: t('Confirm')
    };
  }, [account, t, address]);

  useEffect(() => {
    if (
      (address && !userInfo) ||
      (userInfo?.address &&
        address &&
        !isAddressEqual(userInfo.address, address))
    ) {
      onOpen();
      onBindClose();
    }
  }, [address, userInfo, onOpen, onBindClose]);

  useAccountEffect({
    onDisconnect() {
      signOut();
    }
  });

  const handleClose = useCallback(async () => {
    await updateBindStatux({ bindModalStatus: false });
    onBindClose();
  }, [onBindClose, updateBindStatux]);

  return (
    <>
      <Modal
        autoFocus={false}
        closeOnOverlayClick={false}
        header={t('welcome to DIALECT World')}
        isOpen={isOpen}
        modalIcon="/assets/img/welcome.png"
        modalTip={t(
          'In order to access your account, need to authorize the operation'
        )}
        onClose={onClose}
        showClose
      >
        <Box>
          <Button
            colorScheme="yellow"
            isLoading={flag}
            onClick={signIn}
          >
            {t('To the wallet authorization')}
          </Button>
        </Box>
      </Modal>

      <Modal
        autoFocus={false}
        closeOnOverlayClick={false}
        header={t('Bind Referrer')}
        isOpen={isBindOpen}
        modalIcon="/assets/img/bind.png"
        onClose={handleClose}
        showClose
      >
        <Box>
          <Input
            _focusVisible={{ outline: 'none' }}
            border={'1px solid'}
            borderColor={'blackAlpha.50'}
            borderRadius={'full'}
            color={'black'}
            fontSize={'xs'}
            h={'54px'}
            onChange={e => setAccount(e.target.value as Hash)}
            placeholder={t('Fill The Wallet Address')}
            textAlign={'center'}
            value={account}
          />

          <Box
            color={'blackAlpha.400'}
            fontSize={'xs'}
            my={6}
            textAlign={'center'}
          >
            {t(
              'New players registered through the invitation link will receive their LP computing power and token rewards'
            )}
          </Box>
          <Button
            colorScheme="yellow"
            isDisabled={btnStatus.isDisabled}
            isLoading={flag}
            onClick={bindAddress}
          >
            {btnStatus.text}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AuthModal;
