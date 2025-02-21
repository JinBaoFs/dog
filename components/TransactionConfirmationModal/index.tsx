import {
  Box,
  Text,
  HStack,
  Center,
  Button,
  Image,
  VStack
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { TokenCardPorps } from '@/types/global';
import ChakraMotionBox from '../ChakraMotionBox';
import IconSvg from '../IconSvg';

// import Modal from '../Modal';

export function ConfirmationModalContent({
  val,
  getVal,
  tokens,
  inputLabel
}: {
  onClose: () => void;
  topContent?: () => React.ReactNode;
  bottomContent?: () => React.ReactNode;
  tokens: TokenCardPorps[];
  val: string;
  getVal?: string;
  inputLabel?: string[];
}) {
  const t = useTranslations();
  inputLabel = inputLabel || [t('Pay With'), t('Get')];
  return (
    <Box>
      {tokens.map((item, index) => {
        return !item.hiddenConfirmItem ? (
          <Box
            key={index}
            mb={4}
          >
            <Text
              color={'gray.600'}
              fontSize={'md'}
              mb={1}
            >
              {inputLabel && inputLabel[index]}
            </Text>
            <HStack
              border={'1px solid'}
              borderColor={'black.500'}
              borderRadius={'lg'}
              gap={3}
              h={'64px'}
              p={4}
              w={'full'}
            >
              <Center
                gap={'1.5'}
                justifyContent={'flex-start'}
                lineHeight={8}
                w={'full'}
              >
                <Image
                  alt=""
                  borderRadius={'50%'}
                  h={'24px'}
                  src={item.icon}
                  w={'24px'}
                />
                <Text
                  fontFamily={'500'}
                  lineHeight={'6'}
                >
                  {item.name}
                </Text>
              </Center>
              <Text
                color={'gray.600'}
                fontSize={index ? 'xl' : '2xl'}
              >
                {!index ? val : getVal || val}
              </Text>
            </HStack>
          </Box>
        ) : (
          <Box key={index}></Box>
        );
      })}
    </Box>
  );
}

export function TransactionPendingContent({
  tokens,
  val,
  getVal
}: {
  val: string;
  getVal?: string;
  tokens: TokenCardPorps[];
}) {
  const t = useTranslations();
  return (
    <VStack pt={'60px'}>
      <ChakraMotionBox
        animate={{
          rotate: '3600deg'
        }}
        transformOrigin={'center center'}
        transition={{
          repeat: 'Infinity',
          type: 'tween',
          duration: '20'
        }}
      >
        <Image
          alt=""
          h={'80px'}
          src={'/assets/img/loader.png'}
          w={'80px'}
        />
      </ChakraMotionBox>
      <HStack my={4}>
        <Center gap={2}>
          <Image
            alt=""
            borderRadius={'50%'}
            h={'24px'}
            src={tokens[0].icon}
            w={'24px'}
          />
          <Text
            fontFamily={'500'}
            lineHeight={'6'}
          >
            {val} {tokens[0].name}
          </Text>
        </Center>
        <IconSvg
          boxSize={'4'}
          color={'white'}
          cursor={'pointer'}
          name="down"
          transform={'rotate(-90deg)'}
        />
        <Center gap={2}>
          <Image
            alt=""
            borderRadius={'50%'}
            h={'24px'}
            src={tokens[1].icon}
            w={'24px'}
          />
          <Text
            fontFamily={'500'}
            lineHeight={'6'}
          >
            {getVal || val}{' '}
            {!tokens[1].hiddenNameOfPending ? tokens[1].name : ''}
          </Text>
        </Center>
      </HStack>
      <Text
        color={'gray.600'}
        fontSize={'sm'}
        mb={'12'}
      >
        {t('Please confirm the transaction in your wallet')}
      </Text>
    </VStack>
  );
}

export function TransactionErrorContent({
  onTryAgain
}: {
  message: string;
  onTryAgain: () => void;
  onClose: () => void;
}) {
  const t = useTranslations();
  return (
    <VStack mt={'10'}>
      <IconSvg
        boxSize={'80px'}
        color={'#FAFAFA'}
        name="field"
      />
      <Text
        mb={11}
        mt={6}
      >
        {t('Sorry, we encountered an error')}
      </Text>
      <Button
        _active={{
          bg: 'gray.900'
        }}
        _hover={{
          bg: 'gray.900'
        }}
        bg={'black.700'}
        borderRadius={'md'}
        fontSize={'sm'}
        onClick={onTryAgain}
      >
        {t('Try again')}
      </Button>
    </VStack>
  );
}

export function TransactionSuccessContent({
  successText
}: {
  successText: string;
}) {
  return (
    <VStack mt={'10'}>
      <IconSvg
        boxSize={'80px'}
        color={'#FAFAFA'}
        name="success"
      />
      <Text
        mb={11}
        mt={6}
      >
        {successText}
      </Text>
    </VStack>
  );
}

export default function TransactionConfirmationModal({
  txHash,
  content,
  attemptingTxn,
  header,
  tokens,
  val,
  getVal,
  successText
}: {
  txHash?: string;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  header?: () => React.ReactNode | string;
  tokens: TokenCardPorps[];
  successText: string;
  val: string;
  getVal?: string;
}) {
  return (
    <Box>
      <Box>{header?.()}</Box>
      {attemptingTxn ? (
        <TransactionPendingContent
          getVal={getVal}
          tokens={tokens}
          val={val}
        />
      ) : txHash ? (
        <TransactionSuccessContent successText={successText} />
      ) : (
        content()
      )}
    </Box>
  );
}
