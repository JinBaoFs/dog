'use client';

import {
  Box,
  Text,
  Center,
  Button,
  Flex,
  Image,
  VStack,
  Divider,
  Skeleton
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { NavBar } from '@/components/Header';
import Modal from '@/components/Modal';
import { LEVEL, NFTTYPE } from '@/types/global';
import useMint from '@/hooks/useMint';
import { ApproveState } from '@/hooks/useApproveCallback';

const QUOTA: { [key in LEVEL]: string } = {
  N: '0',
  R: '1000',
  S: '2000',
  SR: '4000',
  SSR: '8000'
};

const NFTModal = ({
  data,
  isOpen,
  onClose,
  comfirBuy,
  sn,
  title
}: {
  data?: NFTTYPE;
  comfirBuy: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  sn?: string;
  title?: string;
}) => {
  const t = useTranslations('MintPage');

  return (
    <Modal
      autoFocus={false}
      closeOnOverlayClick={false}
      header={`NFT ${title}`}
      isOpen={isOpen}
      modalIcon={data?.logo || ''}
      onClose={onClose}
      showClose
    >
      <Box>
        <VStack gap={2}>
          <Center color={'blackAlpha.900'}>{sn}</Center>
          <Center
            bg={'blackAlpha.50'}
            borderRadius={'full'}
            color={'blackAlpha.400'}
            fontSize={'xs'}
            px={2}
            py={1}
            w={'auto'}
          >
            {t('LP Computing Power')}: {data?.lp_num}
          </Center>
        </VStack>

        <Divider
          left={0}
          pos={'absolute'}
          right={0}
          top={'70px'}
        />
        <Flex
          color={'blackAlpha.400'}
          flexDir={'column'}
          fontSize={'xs'}
          gap={4}
          mb={4}
          mt={'32px'}
        >
          <Flex justify={'space-between'}>
            <Box>{t('Purchase Quota')}:</Box>
            <Box color={'blackAlpha.900'}>{QUOTA[data?.name || 'N']} USDT</Box>
          </Flex>
          <Flex justify={'space-between'}>
            <Box>{t('Price')}:</Box>
            <Box color={'yellow.200'}>{data?.price} USDT</Box>
          </Flex>
        </Flex>

        <Button
          colorScheme="yellow"
          onClick={comfirBuy}
        >
          {t('Confirm')}
        </Button>
      </Box>
    </Modal>
  );
};

const Mint = () => {
  const { address } = useAccount();

  const {
    handBtn,
    comfirBuy,
    level,
    quota,
    isOpen,
    onClose,
    btnStatus,
    data,
    userNFTInfo,
    isLoading,
    approvalState,
    handApprove
  } = useMint();

  // useEffect(() => {
  //   onOpen;
  // }, [onOpen]);

  const t = useTranslations('MintPage');
  const commonT = useTranslations('Common');

  return (
    <Box>
      <NavBar text={'NFT Mint'} />
      <Box
        pt={'92px'}
        px={'5'}
      >
        <Box
          borderRadius={'4xl'}
          h={'335px'}
          mb={5}
          overflow={'hidden'}
          pos={'relative'}
          w={'full'}
        >
          <Skeleton isLoaded={!isLoading}>
            <Image
              alt=""
              h={'full'}
              objectFit={'cover'}
              src={userNFTInfo.current?.logo}
              w={'full'}
            />
          </Skeleton>
          <Center
            bg={'rgb(111, 168, 181)'}
            border={'2px solid'}
            borderColor={'white'}
            borderRadius={'full'}
            h={'40px'}
            left={'5'}
            overflow={'hidden'}
            pos={'absolute'}
            top={5}
            w={'40px'}
          >
            <Skeleton isLoaded={!isLoading}>
              <Image
                alt=""
                h={'full'}
                objectFit={'cover'}
                src={`/assets/img/${userNFTInfo.current?.name || 'N'}.png`}
                w={'full'}
              />
            </Skeleton>
          </Center>
        </Box>

        <Flex
          justify={'space-between'}
          mb={10}
        >
          <Flex
            flexDir={'column'}
            gap={3}
          >
            <VStack
              alignItems={'flex-start'}
              gap={1}
            >
              <Box
                color={'whiteAlpha.400'}
                fontSize={'xs'}
              >
                {t('No')}
              </Box>
              <Skeleton isLoaded={!isLoading}>
                <Box fontSize={'4xl'}>
                  {userNFTInfo.current?.order_sn || '#xxxxx'}
                </Box>
              </Skeleton>
            </VStack>
            <VStack
              alignItems={'flex-start'}
              gap={3}
            >
              <Box
                color={'whiteAlpha.400'}
                fontSize={'xs'}
              >
                {t('Purchase Quota')}
              </Box>
              <Skeleton isLoaded={!isLoading}>
                <Box fontSize={'xl'}>
                  {data
                    ? QUOTA[(userNFTInfo.current?.name || 'N') as LEVEL]
                    : '0.000000'}{' '}
                  USDT
                </Box>
              </Skeleton>
            </VStack>
          </Flex>
          <Flex
            flexDir={'column'}
            gap={5}
          >
            <VStack
              alignItems={'flex-start'}
              gap={3}
            >
              <Box
                color={'whiteAlpha.400'}
                fontSize={'xs'}
              >
                {t('LP Computing Power')}
              </Box>
              <Skeleton isLoaded={!isLoading}>
                <Box
                  fontSize={'xl'}
                  lineHeight={'shorts'}
                >
                  {userNFTInfo.current?.lp_num || '0.000000'}
                </Box>
              </Skeleton>
            </VStack>
            <VStack
              alignItems={'flex-start'}
              gap={3}
            >
              <Box
                color={'whiteAlpha.400'}
                fontSize={'xs'}
              >
                {level ? t('Available Amount') : t('Price')}
              </Box>
              <Skeleton isLoaded={!isLoading}>
                <Box
                  color={'yellow.200'}
                  fontSize={'xl'}
                >
                  {level
                    ? formatEther(quota || 0n)
                    : userNFTInfo.current?.price || '0.000000'}
                  USDT
                </Box>
              </Skeleton>
            </VStack>
          </Flex>
        </Flex>

        <Box
          backdropFilter={'blur(20px)'}
          bg={
            'linear-gradient(107deg, rgba(255, 255, 255, 0.26) 1.44%, rgba(255, 255, 255, 0.02) 108.41%)'
          }
          borderRadius={'4xl'}
          mb={'10'}
          px={6}
          py={6}
        >
          <Center
            fontSize={'xl'}
            mb={'5'}
          >
            {t('Card Rules')}
          </Center>
          <Box
            fontSize={'xs'}
            lineHeight={'shorts'}
          >
            <Text>1.{t('NFT cards are not allowed to transfer')}</Text>
            <Text>
              2.{t('NFT cards enjoy the whole network USDT weighted dividends')}
            </Text>
            <Text>
              3.
              {t(
                'Buying an NFT card will get the equivalent LP computing power and enjoy the LP computing power dividend'
              )}
            </Text>
            <Text>
              4.
              {t(
                'Hold the NFT to buy the DOG limit, and the purchase limit can be renewed'
              )}
            </Text>
          </Box>
        </Box>
        {address && (
          <>
            <Flex
              gap={4}
              mb={'100'}
            >
              {approvalState !== ApproveState.APPROVE && (
                <Button
                  colorScheme="yellow"
                  isLoading={approvalState === ApproveState.PENDING}
                  onClick={() => handApprove()}
                  variant={'outline'}
                >
                  {commonT('Aprrove')}
                </Button>
              )}

              <Button
                colorScheme="yellow"
                isDisabled={btnStatus?.disabled}
                onClick={handBtn}
                variant={'solid'}
              >
                {btnStatus?.text}
              </Button>
            </Flex>
            <NFTModal
              comfirBuy={comfirBuy}
              data={userNFTInfo.next}
              isOpen={isOpen}
              onClose={onClose}
              sn={data?.list.order_sn}
              title={btnStatus?.text}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Mint;
