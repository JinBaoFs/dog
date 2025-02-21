import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { formatEther, zeroAddress } from 'viem';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import { Copy } from '@/components/Copy';
import IconSvg, { IconName } from '@/components/IconSvg';
import { Data, EXTRACT_TYPE, RewardDetailModal, Team } from '@/components/Home';
import Language from '@/components/Language';
import Modal from '@/components/Modal';
import { useUserInfo, useCheckSpreadName } from '@/state/userInfo/hook';
import { formateAddress, formatNumber } from '@/lib';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { DOG_ADDRESS } from '@/constants';
import { ERC20 } from '@/constants/abi/erc20';
import { ajaxGet, ajaxPost } from '@/api/axios';
import { axiosUrlType } from '@/api/type';
import { useGetUserCardInfo } from '@/hooks/useMint';

const RewardModal = ({
  type,
  isOpen,
  onClose
}: {
  type: EXTRACT_TYPE | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations('Home');
  return (
    <Modal
      autoFocus={false}
      closeOnOverlayClick={false}
      header={t('Rewards', { name: type === 'DOG' ? 'DOG' : 'USDT' })}
      isOpen={isOpen}
      modalIcon="/assets/img/reward.png"
      onClose={onClose}
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
          mb={'70px'}
          placeholder="0.000000"
          textAlign={'center'}
        />
        <Button colorScheme="yellow">{t('Withdraw')}</Button>
      </Box>
    </Modal>
  );
};

const Home = () => {
  const account = useAccount();
  const t = useTranslations('Home');
  const { isOpen, onClose } = useDisclosure();
  const {
    isOpen: isRewardOpen,
    onOpen: onRewardOpen,
    onClose: onRewardClose
  } = useDisclosure();
  const searchParams = useSearchParams();
  const userInfo = useUserInfo();
  const checkSpreadName = useCheckSpreadName();

  const [type, setType] = useState<EXTRACT_TYPE | null>(null);

  const { trigger, isMutating } = useSWRMutation(
    'withdraw',
    (url: any, { arg }: { arg: EXTRACT_TYPE }) =>
      ajaxPost(url as axiosUrlType, {
        type: arg.toLowerCase()
      })
  );

  const handBtn = useCallback(
    async (type: EXTRACT_TYPE) => {
      checkSpreadName();
      setType(type);
      trigger(type);
    },
    [setType, trigger, checkSpreadName]
  );

  const handReward = useCallback(
    (type: EXTRACT_TYPE) => {
      if (!userInfo) return;
      setType(type);
      onRewardOpen();
    },
    [userInfo, setType, onRewardOpen]
  );

  const invateCode = searchParams.get('invateCode');

  useEffect(() => {
    if (typeof localStorage !== 'undefined' && invateCode) {
      localStorage.setItem('invateCode', invateCode);
    }
  }, [invateCode]);

  const invateLink = useMemo(() => {
    return `${location.href.split('?')[0]}?invateCode=${account.address}`;
  }, [account]);

  const dogBalance = useSingleCallResult({
    address: DOG_ADDRESS,
    functionName: 'balanceOf',
    abi: ERC20,
    args: [zeroAddress]
  });

  const { data } = useSWR<{ list: { holderCount: string } }>(
    'dogInfo',
    (url: any) => ajaxGet(url as axiosUrlType)
  );

  const userCardInfo = useGetUserCardInfo();

  return (
    <Box pt={'104px'}>
      <Header />
      <Box px={6}>
        <Center
          flexDir={'column'}
          fontWeight={'extrabold'}
          gap={1.5}
        >
          <Box
            fontSize={'5xl'}
            textAlign={'center'}
          >
            {t('Cast')}
            <Box
              as={'span'}
              color={'yellow.200'}
            >
              {t('the future world')}
            </Box>
          </Box>
          <Box
            fontSize={'md'}
            px={2}
          >
            {' '}
            {t('DOG WORLD')}
          </Box>
        </Center>
        <Box
          mt={'217px'}
          pos={'relative'}
        >
          <Image
            alt=""
            height={'417px'}
            // left={'-6'}
            pos={'absolute'}
            // right={'0'}
            src="/assets/img/hero.png"
            top={'-270'}
            w={'calc(100vw + 48px)'}
            zIndex={'hide'}
          />

          <Box
            backdropFilter={'blur(20px)'}
            bg={
              'linear-gradient(107deg, rgba(126, 126, 126, 0.40) 1.44%, rgba(126, 126, 126, 0.00) 108.41%)'
            }
            borderRadius={'4xl'}
            p={6}
          >
            <VStack
              backdropFilter={'blur(10px)'}
              bg={
                'linear-gradient(107deg, rgba(126, 126, 126, 0.40) 1.44%, rgba(126, 126, 126, 0.00) 108.41%)'
              }
              borderRadius={'4xl'}
              fontSize={'2xl'}
              gap={1}
              h={'74px'}
              p={2}
            >
              <Box fontSize={'sm'}>{t('Rewards', { name: 'DOG' })}</Box>
              <Box color={'yellow.200'}>
                {formatNumber(userInfo?.dog_money || '0')}
              </Box>
            </VStack>
            <Flex
              mb={4}
              mt={'6'}
            >
              <VStack
                alignItems={'center'}
                flex={1}
                gap={1}
              >
                <Box fontSize={'xs'}>{t('Direct Rromotion Rewards')}</Box>
                <Box fontSize={'sm'}>
                  {formatNumber(userInfo?.reward_money || '0')}
                </Box>
              </VStack>
              <VStack
                alignItems={'center'}
                flex={1}
                gap={1}
              >
                <Box fontSize={'xs'}>{t('Team Rewards')}</Box>
                <Box fontSize={'sm'}>
                  {formatNumber(userInfo?.team_money || '0')}
                </Box>
              </VStack>
              <VStack
                alignItems={'center'}
                flex={1}
                gap={1}
              >
                <Box fontSize={'xs'}>{t('Weighted Reward')}</Box>
                <Box fontSize={'sm'}>
                  {formatNumber(userInfo?.weight_money || '0')}
                </Box>
              </VStack>
            </Flex>
            <Button
              colorScheme={'yellow'}
              isDisabled={!+(userInfo?.dog_money || 0)}
              isLoading={type === 'DOG' && isMutating}
              onClick={() => handBtn('DOG')}
              variant={'outline'}
            >
              {t('Withdraw')}
            </Button>
          </Box>
        </Box>

        <Box
          mt={'217px'}
          pos={'relative'}
        >
          <Image
            alt=""
            height={'448px'}
            // left={'-6'}
            pos={'absolute'}
            // right={'0'}
            src="/assets/img/hero1.png"
            top={'-270'}
            w={'calc(100vw + 48px)'}
            zIndex={'hide'}
          />

          <Box
            backdropFilter={'blur(20px)'}
            bg={
              'linear-gradient(107deg, rgba(126, 126, 126, 0.40) 1.44%, rgba(126, 126, 126, 0.00) 108.41%)'
            }
            borderRadius={'4xl'}
            p={6}
          >
            <VStack
              backdropFilter={'blur(10px)'}
              bg={
                'linear-gradient(107deg, rgba(126, 126, 126, 0.40) 1.44%, rgba(126, 126, 126, 0.00) 108.41%)'
              }
              borderRadius={'4xl'}
              fontSize={'2xl'}
              gap={1}
              h={'74px'}
              p={2}
            >
              <Box fontSize={'sm'}>{t('Rewards', { name: 'USDT' })}</Box>
              <Box color={'yellow.200'}>
                {formatNumber(userInfo?.usdt_money || '0')}
              </Box>
            </VStack>
            <Button
              colorScheme={'yellow'}
              isDisabled={!+(userInfo?.usdt_money || 0)}
              isLoading={type === 'USDT' && isMutating}
              mt={'6'}
              onClick={() => handBtn('USDT')}
              variant={'outline'}
            >
              {t('Withdraw')}
            </Button>
          </Box>
        </Box>

        <RewardModal
          isOpen={isOpen}
          onClose={onClose}
          type={type}
        />

        <Box
          mb={10}
          mt={'9'}
        >
          {userInfo && (
            <>
              <Center
                fontSize={'2xl'}
                mb={'5'}
              >
                {t('Referral Link')}
              </Center>
              <Center
                color={'whiteAlpha.400'}
                gap={5}
              >
                {`${invateLink.slice(0, 10)}...${invateLink.slice(-10)}`}
                <Copy
                  color={'whiteAlpha.400'}
                  text={invateLink}
                />
              </Center>
            </>
          )}
        </Box>

        <Box
          backdropFilter={'blur(20px)'}
          bg={
            'linear-gradient(107deg, rgba(255, 255, 255, 0.26)1.44%, rgba(255, 255, 255, 0.02) 108.41%)'
          }
          borderRadius={'4xl'}
          p={6}
        >
          <Center mb={'5'}>{t('Dashboard')}</Center>

          <Center
            flexDir={'column'}
            gap={4}
          >
            {userInfo && userInfo.spread_name && (
              <Flex
                fontSize={'xs'}
                justifyContent={'space-between'}
                w={'full'}
              >
                <Box>{t('Referrer')}</Box>
                <Flex gap={2}>
                  {formateAddress(userInfo.spread_name)}
                  <Copy text={userInfo.spread_name} />
                </Flex>
              </Flex>
            )}
            <Flex
              fontSize={'xs'}
              justifyContent={'space-between'}
              w={'full'}
            >
              <Box>{t('Available Amount')}</Box>
              <Link href={'/mint'}>
                <Center gap={2}>
                  <Box>
                    {formatNumber(formatEther(userCardInfo?.result?.[1] || 0n))}{' '}
                    USDT
                  </Box>
                  <IconSvg
                    boxSize={'3'}
                    color={'white'}
                    name="right"
                  />
                </Center>
              </Link>
            </Flex>
            <Flex
              fontSize={'xs'}
              justifyContent={'space-between'}
              w={'full'}
            >
              <Box>{t('LP Computing Power')}</Box>
              <Center
                gap={2}
                onClick={() => handReward('LP')}
              >
                <Box>{formatNumber(userInfo?.lp_money || '0')}</Box>
                <IconSvg
                  boxSize={'3'}
                  color={'white'}
                  name="right"
                />
              </Center>
            </Flex>

            <Flex
              fontSize={'xs'}
              justifyContent={'space-between'}
              w={'full'}
            >
              <Box>{t('Historical DOG Rewards')}</Box>
              <Center
                gap={2}
                onClick={() => handReward('DOG')}
              >
                <Box>{formatNumber(`${userInfo?.history_dog}` || '0')}</Box>
                <IconSvg
                  boxSize={'3'}
                  color={'white'}
                  name="right"
                />
              </Center>
            </Flex>
            <Flex
              fontSize={'xs'}
              justifyContent={'space-between'}
              w={'full'}
            >
              <Box>{t('Historical USDT Rewards')}</Box>
              <Center
                gap={2}
                onClick={() => handReward('USDT')}
              >
                <Box>{formatNumber(`${userInfo?.history_usdt}` || '0')}</Box>
                <IconSvg
                  boxSize={'3'}
                  color={'white'}
                  name="right"
                />
              </Center>
            </Flex>
          </Center>
        </Box>

        <RewardDetailModal
          isOpen={isRewardOpen}
          onClose={onRewardClose}
          type={type}
        />

        <Box
          backdropFilter={'blur(20px)'}
          bg={
            'linear-gradient(107deg, rgba(255, 255, 255, 0.26)1.44%, rgba(255, 255, 255, 0.02) 108.41%)'
          }
          borderRadius={'4xl'}
          mt={'10'}
          p={6}
        >
          <Center mb={'5'}>{t('My Team')}</Center>

          <Center
            fontSize={'xs'}
            justifyContent={'space-between'}
            mb={4}
          >
            <Box>{t('Directly Push Address')}</Box>
            <Box>{t('Number In Net')}</Box>
          </Center>

          <Box>
            <Team />
          </Box>
        </Box>

        <Box
          backdropFilter={'blur(20px)'}
          bg={
            'linear-gradient(107deg, rgba(255, 255, 255, 0.26)1.44%, rgba(255, 255, 255, 0.02) 108.41%)'
          }
          borderRadius={'4xl'}
          mb={'100px'}
          mt={'10'}
          p={6}
        >
          <Center mb={'5'}>{t('DOG Data')}</Center>

          <Flex
            mb={'5'}
            pos={'relative'}
          >
            <VStack
              flex={1}
              gap={1}
            >
              <Box
                color={'whiteAlpha.400'}
                fontSize={'xs'}
              >
                {t('Total Destroyed')}
              </Box>
              <Box
                color={'yellow.200'}
                fontSize={'md'}
              >
                {formatNumber(formatEther((dogBalance?.result as never) || 0n))}
              </Box>
            </VStack>
            <Box
              bg={'whiteAlpha.400'}
              height={'24px'}
              left={'50%'}
              mt={'2.5'}
              w={'1px'}
            ></Box>
            <VStack
              flex={1}
              gap={1}
            >
              <Box
                color={'whiteAlpha.400'}
                fontSize={'xs'}
              >
                {t('Holders')}
              </Box>
              <Box
                color={'yellow.200'}
                fontSize={'md'}
              >
                {data?.list.holderCount}
              </Box>
            </VStack>
          </Flex>

          <Box>
            <Data />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
export default Home;

const Footer = () => {
  const t = useTranslations('Home');

  const iconList = useMemo<Array<{ icon: IconName; url: string }>>(() => {
    return [
      {
        icon: 'note',
        url: ''
      },
      {
        icon: 'x',
        url: ''
      },
      {
        icon: 'telegram',
        url: ''
      }
    ];
  }, []);

  return (
    <Box
      backdropFilter={'blur(40px)'}
      bg={'blackAlpha.400'}
      border={'1px solid'}
      borderColor={'whiteAlpha.300'}
      borderRadius={'full'}
      bottom={'5'}
      h={'44px'}
      left={'5'}
      // maxW={'600px'}
      pos={'fixed'}
      right={5}
    >
      <Flex
        alignItems={'center'}
        color={'white'}
        gap={5}
        h={'full'}
        px={5}
      >
        <Popover
          gutter={20}
          placement="top"
          strategy="fixed"
        >
          <PopoverTrigger>
            <IconSvg
              boxSize={4}
              name="left"
              transform={'rotate(90deg)'}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              _focusVisible={{
                boxShadow: 'none',
                outline: 'none'
              }}
              backdropFilter={'blur(40px)'}
              bg={'blackAlpha.400'}
              border={'none'}
              borderRadius={'2.5xl'}
              w={'185px'}
            >
              <PopoverBody
                color={'whiteAlpha.500'}
                p={0}
              >
                <Language />
                <Flex
                  borderTop={'1px solid'}
                  borderTopColor={'whiteAlpha.300'}
                  color={'white'}
                  justify={'space-between'}
                  px={4}
                  py={3}
                >
                  {iconList.map((item, index) => {
                    return (
                      <Link
                        href={item.url}
                        key={index}
                      >
                        <IconSvg
                          boxSize={4}
                          name={item.icon}
                        />
                      </Link>
                    );
                  })}
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>

        <Flex flex={1}>
          <Center
            as={Link}
            flex={1}
            href={'/mint'}
          >
            {t('NFT Mint')}
          </Center>
          <Center
            as={Link}
            flex={1}
            href={'/swap'}
          >
            {t('SWAP')}
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};
