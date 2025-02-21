import { useCallback } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { TokenCardPorps } from '@/types/global';
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal';
import IconSvg from '../IconSvg';

export function ModalHeader({
  title,
  onClose
}: {
  title: string;
  onClose?: () => void;
}) {
  return (
    <Flex
      alignContent={'center'}
      gap={1}
      mb={'4'}
    >
      {onClose && (
        <IconSvg
          boxSize={'4'}
          color={'#7F7F7F'}
          cursor={'pointer'}
          name="left"
          onClick={onClose}
        />
      )}
      <Text>{title}</Text>
    </Flex>
  );
}

export default function ConfirmMintRedeemModal({
  onClose,
  txHash,
  errorMessage,
  attemptingTxn,
  tokens,
  val,
  getVal,
  onTryAgain,
  successText,
  inputLabel
}: {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  errorMessage?: string;
  attemptingTxn: boolean;
  tokens: TokenCardPorps[];
  val: string;
  getVal?: string;
  successText: string;
  onTryAgain: () => void;
  inputLabel?: string[];
}) {
  const t = useTranslations();
  const confirmationHeader = useCallback(() => {
    if (attemptingTxn) return t('Pending');
    if (errorMessage)
      return (
        <ModalHeader
          onClose={onClose}
          title={t('Error')}
        />
      );
    if (txHash)
      return (
        <ModalHeader
          onClose={onClose}
          title={t('Success')}
        />
      );
    return (
      <ModalHeader
        onClose={onClose}
        title={t('Order Confirmation')}
      />
    );
  }, [attemptingTxn, t, errorMessage, onClose, txHash]);

  const confirmationContent = useCallback(() => {
    return errorMessage ? (
      <TransactionErrorContent
        message={errorMessage}
        onClose={onClose}
        onTryAgain={onTryAgain}
      />
    ) : (
      <ConfirmationModalContent
        getVal={getVal}
        inputLabel={inputLabel}
        onClose={onClose}
        tokens={tokens}
        val={val}
      />
    );
  }, [onClose, onTryAgain, errorMessage, inputLabel, tokens, val, getVal]);

  return (
    <TransactionConfirmationModal
      attemptingTxn={attemptingTxn}
      content={confirmationContent}
      getVal={getVal}
      header={confirmationHeader}
      successText={successText}
      tokens={tokens}
      txHash={txHash}
      val={val}
    />
  );
}
