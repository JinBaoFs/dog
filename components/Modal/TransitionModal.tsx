'use client';
import { useTranslations } from 'next-intl';
import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import {
  useTxModalStatus,
  useUpdateTxModalStatus
} from '@/state/userInfo/hook';
import { TXStatus } from '@/types/global';
import Modal from '.';

export const TransitionModal = () => {
  const t = useTranslations('Common');
  const status = useTxModalStatus();
  const updateTxModalStatus = useUpdateTxModalStatus();

  const title = useMemo<{ [key in TXStatus]: string }>(() => {
    return {
      success: t('Completed'),
      fail: t('Failed'),
      pending: t('Waiting For Confirmation')
    };
  }, [t]);

  return (
    <Modal
      autoFocus={false}
      closeOnOverlayClick={false}
      header={title[status as TXStatus]}
      isOpen={!!status}
      modalIcon={`/assets/img/${status}.png`}
      modalTip={
        status === 'pending' ? t('Confirm this transaction in your wallet') : ''
      }
      onClose={() =>
        updateTxModalStatus({
          status: null
        })
      }
      showClose
    >
      <Box></Box>
    </Modal>
  );
};
