'use client';

import {
  Box,
  BoxProps,
  Button,
  Center,
  Divider,
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

import { formatNumber, formatNumberToK } from '@/lib';
import useSwap from '@/hooks/useSwap';
import { ApproveState } from '@/hooks/useApproveCallback';
import { TOKEN_SYMBOL } from '@/constants';
// import KLineChart from './KLineChart';

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
    tokenInfo,
    configData
  } = useSwap();

  return (
    <Box>
      <NavBar text={'SWAP'} />
      <Box
        pt={'92px'}
        px={'5'}
      >
        <Flex
          flexDir={'column'}
          fontSize={'sm'}
          gap={2}
        >
          <Flex justify={'space-between'}>
            <Box>{TOKEN_SYMBOL}</Box>
            <Box>
              {formatNumberToK(`${tokenInfo.USDT}`)} USDT/
              {formatNumberToK(`${tokenInfo.Token}`)} {TOKEN_SYMBOL}
            </Box>
          </Flex>
          <Flex justify={'space-between'}>
            <Box>
              {t('Circulating Supply')}: {tokenInfo.circulation}
            </Box>
            <Box>
              {t('Market Cap')}: ${tokenInfo.market}
            </Box>
          </Flex>
        </Flex>

        {/* <KLineChart onChangePrice={onChangePrice} /> */}
        <Divider
          borderColor={'whiteAlpha.300'}
          my={5}
        />
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
            {t('Buy DIALECT', { name: TOKEN_SYMBOL })}
          </Box>
          <Box
            color={index === 1 ? 'white' : ''}
            onClick={() => setIndex(1)}
            transitionDuration={'normal'}
          >
            {t('Sell DIALECT', { name: TOKEN_SYMBOL })}
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
                  <Box fontSize={'md'}>{index ? TOKEN_SYMBOL : 'USDT'}</Box>
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
                      <Box>
                        {formatNumber(`${+tokenInfo.USDT / +tokenInfo.Token}`)}{' '}
                        USDT/{TOKEN_SYMBOL}
                      </Box>
                    ) : (
                      <Box>
                        {formatNumber(`${+tokenInfo.Token / +tokenInfo.USDT}`)}{' '}
                        {TOKEN_SYMBOL}/USDT
                      </Box>
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
                        'Buying DIALECT will consume the equivalent amount of USDT',
                        { name: TOKEN_SYMBOL }
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
                  {commonT('Approve')}
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
                          'Get the equivalent LP computing power invested in USDT',
                          {
                            rate: configData?.buy_coin_rate
                              ? +configData?.buy_coin_rate * 100
                              : '0'
                          }
                        )}
                      ></Tooltip>
                    </Flex>
                    <Box>
                      {val && configData?.buy_coin_rate
                        ? formatNumber(String(+val * +configData.buy_coin_rate))
                        : val || '--'}
                    </Box>
                  </Flex>
                  <Flex
                    justify={'space-between'}
                    w={'full'}
                  >
                    <Flex
                      align={'center'}
                      gap={2}
                    >
                      {t('Expected receive DIALECT', { name: TOKEN_SYMBOL })}:{' '}
                      <Tooltip
                        label={t(
                          'Get the input of USDT 33% equivalent DIALECT quantity',
                          { name: TOKEN_SYMBOL }
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
                      label={t('Get 85% of the sold value USDT', {
                        rate: configData?.sell_rate
                      })}
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
