import { Box, Center, Flex } from '@chakra-ui/react';
import { useRef, useMemo, useCallback, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { zeroAddress } from 'viem';
import REQUEST_API from '@/api/api';
import { ajaxGet } from '@/api/axios';
import { axiosUrlType } from '@/api/type';
import { ListData } from '@/types/global';
import { useUserInfo } from '@/state/userInfo/hook';
import { formateAddress } from '@/lib';
import { DIALECT_ADDRESS, POOL_ADDRESS } from '@/constants';
import { Copy } from '../Copy';
import Modal from '../Modal';
import LoadDataContainer from '../LoadDataContainer';

export const Team = () => {
  const userInfo = useUserInfo();
  // const { isOpen: isTreeOpen, onOpen: onTreeOpen, onClose: onTreeClose } = useDisclosure();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    (index: number) => {
      return userInfo ? `${REQUEST_API.spreadList}?page=${index + 1}` : null;
    },
    url =>
      ajaxGet<ListData<{ nickname: string; team_count: number }>>(
        url as axiosUrlType,
        {
          limit: 10
        }
      ),
    {
      revalidateFirstPage: false
    }
  );
  const isEnd = useMemo(
    () => (data ? data?.[data?.length - 1]?.data?.list?.length < 10 : false),
    [data]
  );

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const isBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;

      if (isBottom && !isValidating && !isEnd) {
        setSize(size + 1);
      }
    }
  }, [size, isEnd, setSize, isValidating]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef, handleScroll]);

  return (
    <Box
      h={'90px'}
      overflowY={'auto'}
      ref={containerRef}
    >
      <Flex
        flexDir={'column'}
        fontSize={'xs'}
        gap={4}
      >
        <LoadDataContainer
          isLoading={isLoading}
          isNoData={!data?.[0].data?.list.length}
          noNeedConnectWallet
        >
          {data?.map((item, index) => {
            return item?.data?.list?.map(child => {
              return (
                <Flex
                  justify={'space-between'}
                  key={`${index}-${child.nickname}`}
                >
                  <Box>{child.nickname}</Box>
                  <Box
                    color={'yellow.200'}
                    // onClick={onTreeOpen}
                    textDecor={'underline'}
                  >
                    {child.team_count}
                  </Box>
                </Flex>
              );
            });
          })}
        </LoadDataContainer>
      </Flex>
      {/* <UserTreeModal isOpen={isTreeOpen}
        onClose={onTreeClose} /> */}
    </Box>
  );
};

export type EXTRACT_TYPE = 'DOG' | 'USDT' | 'LP';
export const RewardDetailModal = ({
  type,
  isOpen,
  onClose
}: {
  type: EXTRACT_TYPE | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const urls = useMemo<{
    [key in EXTRACT_TYPE]: string;
  }>(() => {
    return {
      ['DOG']: REQUEST_API.dogList,
      ['LP']: REQUEST_API.lpList,
      ['USDT']: REQUEST_API.usdtList
    };
  }, []);

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    (index: number) => {
      return type ? `${urls[type]}?page=${index + 1}` : null;
    },
    url =>
      ajaxGet<
        ListData<{
          time: number;
          title: string;
          pm: number;
          number: string;
        }>
      >(url as axiosUrlType, {
        limit: 10
      }),
    {
      revalidateFirstPage: true
    }
  );

  const isEnd = useMemo(
    () => (data ? data?.[data?.length - 1]?.data?.list?.length < 10 : false),
    [data]
  );

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const isBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;

      if (isBottom && !isValidating && !isEnd) {
        setSize(size + 1);
      }
    }
  }, [size, isEnd, setSize, isValidating]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef, handleScroll]);

  const t = useTranslations('Home');

  const titleConfig = useMemo<{ [key in EXTRACT_TYPE]: string }>(() => {
    return {
      DOG: 'DIALECT Reward Details',
      LP: 'Details Of LP Computing Power',
      USDT: 'USDT Reward Details'
    };
  }, []);

  return (
    <Modal
      autoFocus={false}
      closeOnOverlayClick={false}
      header={t(titleConfig[type || 'DOG'])}
      isOpen={isOpen}
      modalIcon={`/assets/img/${type === 'LP' ? 'lp' : 'rewardList'}.png`}
      onClose={onClose}
      showClose
    >
      <Box>
        <Flex
          color={'blackAlpha.900'}
          fontSize={'xs'}
          mb={6}
        >
          <Center flex={1}>{t('Time')}</Center>
          <Center w={'80px'}>{t('Quantity')}</Center>
          <Center flex={1}>{t('Type')}</Center>
        </Flex>
        <Box
          maxH={'200px'}
          minH={'100px'}
          overflowY={'auto'}
          ref={containerRef}
        >
          <LoadDataContainer
            isLoading={isLoading}
            isNoData={!data?.[0].data?.list.length}
            noNeedConnectWallet
          >
            {data?.map((item, index) => {
              return item?.data?.list?.map((child, _index) => {
                return (
                  <Flex
                    color={'blackAlpha.900'}
                    fontSize={'xs'}
                    key={`${index}-${_index}`}
                    mb={6}
                  >
                    <Center flex={1}>
                      {dayjs(child.time * 1000).format('MM-DD HH:mm:ss')}
                    </Center>
                    <Center w={'80px'}>
                      {child.pm === 1 ? '+' : '-'}
                      {child.number}
                    </Center>
                    <Center flex={1}>{child.title}</Center>
                  </Flex>
                );
              });
            })}
          </LoadDataContainer>
        </Box>
      </Box>
    </Modal>
  );
};

export const UserTreeModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations('Home');

  return (
    <Modal
      autoFocus={false}
      closeOnOverlayClick={false}
      header={t('Number In Net')}
      isOpen={isOpen}
      modalIcon={'/assets/img/tree.png'}
      onClose={onClose}
      showClose
    >
      <Box>
        <Flex
          color={'blackAlpha.900'}
          fontSize={'xs'}
          mb={6}
        >
          <Center flex={1}>{t('Hierarchy')}</Center>
          <Center flex={1}>{t('Number')}</Center>
        </Flex>
        <Box
          minH={'100px'}
          overflowY={'auto'}
        >
          <Flex
            color={'blackAlpha.900'}
            fontSize={'xs'}
            mb={6}
          >
            <Center flex={1}>1</Center>
            <Center flex={1}>2</Center>
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};

export const Data = () => {
  const t = useTranslations('Home');

  return (
    <Box
      h={'90px'}
      overflowY={'auto'}
    >
      <Flex
        flexDir={'column'}
        fontSize={'xs'}
        gap={4}
      >
        <Flex justify={'space-between'}>
          <Box>{t('Token Contract')}</Box>
          <Flex gap={2}>
            {formateAddress(DIALECT_ADDRESS)} <Copy text={DIALECT_ADDRESS} />
          </Flex>
        </Flex>
        <Flex justify={'space-between'}>
          <Box>{t('Coinage Contract')}</Box>
          <Flex gap={2}>
            {formateAddress(POOL_ADDRESS)} <Copy text={POOL_ADDRESS} />
          </Flex>
        </Flex>
        <Flex justify={'space-between'}>
          <Box>{t('Destroy Contract')}</Box>
          <Flex gap={2}>
            {formateAddress(zeroAddress)} <Copy text={zeroAddress} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
