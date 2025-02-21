'use client';

import {
  Box,
  BoxProps,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Skeleton,
  useBoolean
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';
import { AnimatePresence } from 'framer-motion';
import { formatEther } from 'viem';
import { NavBar } from '@/components/Header';
import Tooltip from '@/components/Tooltip';
import IconSvg from '@/components/IconSvg';
import ChakraMotionBox from '@/components/ChakraMotionBox';

import { formatNumber } from '@/lib';
import useSwap from '@/hooks/useSwap';
import { ApproveState } from '@/hooks/useApproveCallback';
import KLineChart from './KLineChart';

const AnimateBox = ({
  children,
  keyStr,
  scale,
  delay,
  ...boxProps
}: PropsWithChildren & {
  keyStr: string;
  scale?: number;
  delay?: number;
} & BoxProps) => {
  const textVariants = {
    enter: { y: 20, opacity: 0, scale: scale || 1 },
    center: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -20, opacity: 0, scale: scale || 1 }
  };

  return (
    <AnimatePresence mode="popLayout">
      <ChakraMotionBox
        animate="center"
        exit="exit"
        initial="enter"
        key={keyStr}
        lineHeight={'100%'}
        transition={{ duration: '0.5', type: 'tween', delay: `${delay || 0}` }}
        variants={textVariants}
        w={'full'}
        {...boxProps}
      >
        {children}
      </ChakraMotionBox>
    </AnimatePresence>
  );
};

const Mint = () => {
  const t = useTranslations('SwapPage');
  const commonT = useTranslations('Common');

  const [flag, setFlag] = useBoolean();

  const {
    getVal,
    price,
    btnStatus,
    handApprove,
    handleBtn,
    onChange,
    val,
    handlerMax,
    index,
    setIndex,
    balanceOf,
    approvalState,
    quota,
    onChangePrice
  } = useSwap();

  return (
    <Box>
      <NavBar text={'SWAP'} />
      <Box
        pt={'92px'}
        px={'5'}
      >
        <KLineChart onChangePrice={onChangePrice} />

        <Center
          color={'whiteAlpha.400'}
          fontSize={'md'}
          gap={10}
          mb={5}
          mt={5}
        >
          <Box
            color={index === 0 ? 'white' : ''}
            onClick={() => setIndex(0)}
            transitionDuration={'normal'}
          >
            {t('Buy DOG')}
          </Box>
          <Box
            color={index === 1 ? 'white' : ''}
            onClick={() => setIndex(1)}
            transitionDuration={'normal'}
          >
            {t('Sell DOG')}
          </Box>
        </Center>

        <Box
          backdropFilter={'blur(20px)'}
          bg={
            'linear-gradient(107deg, rgba(255, 255, 255, 0.26) 1.44%, rgba(255, 255, 255, 0.02) 108.41%)'
          }
          borderRadius={'4xl'}
          mb={'10'}
          py={6}
        >
          <Box
            borderBottom={'1px solid'}
            borderBottomColor={'whiteAlpha.100'}
            pb={3}
            px={6}
          >
            <Flex
              border={'1px solid'}
              borderColor={'white'}
              borderRadius={'2.5xl'}
              h={'44px'}
              justify={'space-between'}
              overflow={'hidden'}
              px={0.5}
            >
              <Input
                _focusVisible={{
                  outline: 'none'
                }}
                onChange={onChange}
                pl={4}
                placeholder="0.000000"
                value={val}
                w={'200px'}
              />
              <Flex
                alignItems={'center'}
                bg={'whiteAlpha.400'}
                borderRadius={'full'}
                gap={2}
                p={2}
              >
                <AnimateBox
                  keyStr={`${index}`}
                  scale={0.7}
                >
                  <Image
                    alt=""
                    borderRadius={'full'}
                    h={'24px'}
                    minW={'24px'}
                    src={`/assets/img/${index ? 'dog' : 'usdt'}.png`}
                  />
                </AnimateBox>

                <AnimateBox
                  keyStr={`${index}`}
                  scale={0.2}
                >
                  <Box fontSize={'md'}>{index ? 'DOG' : 'USDT'}</Box>
                </AnimateBox>
              </Flex>
            </Flex>
            <Flex
              color={'whiteAlpha.400'}
              fontSize={'xs'}
              justify={'space-between'}
              mt={3}
            >
              <Flex alignItems={'center'}>
                {t('Balance')}:
                <Skeleton isLoaded={!balanceOf[0]?.loading}>
                  {formatNumber(
                    formatEther((balanceOf[index]?.result || 0n) as never)
                  ) || '0.000000'}
                </Skeleton>
              </Flex>
              <Box
                color={'yellow.200'}
                onClick={handlerMax}
              >
                {t('All')}
              </Box>
            </Flex>
          </Box>

          <Box
            pt={3}
            px={6}
          >
            <Flex
              flexDir={'column'}
              gap={3}
              mb={5}
            >
              <Flex
                justify={'space-between'}
                w={'full'}
              >
                <Box>{t('Price')}:</Box>
                <Flex
                  align={'center'}
                  gap={2}
                >
                  <>
                    {!flag ? (
                      <Box>{formatNumber(`${price}`)} USDT/DOG</Box>
                    ) : (
                      <Box>{formatNumber(`${1 / price}`)} DOG/USDT</Box>
                    )}
                  </>{' '}
                  <IconSvg
                    boxSize={4}
                    name="exchange"
                    onClick={() => setFlag.toggle()}
                  />
                </Flex>
              </Flex>
              {!index && (
                <Flex
                  justify={'space-between'}
                  w={'full'}
                >
                  <Box>{t('Available Credit')}:</Box>
                  <Flex
                    align={'center'}
                    gap={2}
                  >
                    {formatNumber(formatEther(quota || 0n))} USDT
                    <Tooltip
                      label={t(
                        'Buying DOG will consume the equivalent amount of USDT'
                      )}
                    ></Tooltip>
                  </Flex>
                </Flex>
              )}
            </Flex>

            <Flex
              gap={4}
              mb={'5'}
            >
              {+val && approvalState !== ApproveState.APPROVE ? (
                <Button
                  colorScheme="yellow"
                  onClick={handApprove}
                  variant={'outline'}
                >
                  {commonT('Aprrove')}
                </Button>
              ) : (
                <></>
              )}

              <Button
                colorScheme="yellow"
                isDisabled={btnStatus?.isDisabled}
                onClick={handleBtn}
                variant={'solid'}
              >
                {btnStatus?.text}
              </Button>
            </Flex>

            <Flex
              flexDir={'column'}
              gap={3}
            >
              {!index ? (
                <>
                  <Flex
                    justify={'space-between'}
                    w={'full'}
                  >
                    <Flex
                      align={'center'}
                      gap={2}
                    >
                      {t('Expected receive LP computing power')}:{' '}
                      <Tooltip
                        label={t(
                          'Get the equivalent LP computing power invested in USDT'
                        )}
                      ></Tooltip>
                    </Flex>
                    <Box>{val || '--'}</Box>
                  </Flex>
                  <Flex
                    justify={'space-between'}
                    w={'full'}
                  >
                    <Flex
                      align={'center'}
                      gap={2}
                    >
                      {t('Expected receive DOG')}:{' '}
                      <Tooltip
                        label={t(
                          'Get the input of USDT 33% equivalent DOG quantity'
                        )}
                      ></Tooltip>
                    </Flex>
                    <Box>{+formatNumber(getVal) || '--'}</Box>
                  </Flex>
                </>
              ) : (
                <Flex
                  justify={'space-between'}
                  w={'full'}
                >
                  <Flex
                    align={'center'}
                    gap={2}
                  >
                    {t('Expected receive USDT')}:{' '}
                    <Tooltip
                      label={t('Get 85% of the sold value USDT')}
                    ></Tooltip>
                  </Flex>
                  <Box>{+formatNumber(getVal) || '--'}</Box>
                </Flex>
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Mint;
