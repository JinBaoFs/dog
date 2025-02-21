'use client';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { isAddressEqual, Hash, formatEther, parseEther, isAddress } from 'viem';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  DIALECT_ADDRESS,
  RECHARGE_ADDRESS,
  WHITELIST_ADDRESS,
  POOL_ADDRESS,
  BUY_SELL_ADDRESS,
  MINT_ADDRESS,
  TOKEN_SYMBOL
} from '@/constants';
import Header from '@/components/Header';
import { usePair } from '@/hooks/useSwap';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { ERC20 } from '@/constants/abi/erc20';
import { QUOTA_ABI } from '@/constants/abi/quota';
import { formatNumber } from '@/lib';
import { useUpdateTxModalStatus } from '@/state/userInfo/hook';

const WHITELIST_ADDRESS_LST = [
  WHITELIST_ADDRESS,
  RECHARGE_ADDRESS,
  POOL_ADDRESS
];

const Rechage = () => {
  const { address } = useAccount();

  const publicClient = usePublicClient();

  const { pairAddress, resives0 } = usePair();

  const lpBalanceOf = useSingleCallResult({
    abi: ERC20,
    functionName: 'balanceOf',
    address: pairAddress?.result as never,
    args: [address as Hash]
  });

  const wlpBalanceOf = useSingleCallResult({
    abi: ERC20,
    functionName: 'balanceOf',
    address: pairAddress?.result as never,
    args: [WHITELIST_ADDRESS as Hash]
  });

  const tokenBalanceOf = useSingleCallResult({
    abi: ERC20,
    functionName: 'balanceOf',
    address: DIALECT_ADDRESS,
    args: [address as Hash]
  });

  const { result: isMarketer } = useSingleCallResult({
    abi: ERC20,
    functionName: 'isMarketer',
    address: DIALECT_ADDRESS,
    args: [WHITELIST_ADDRESS as Hash]
  });

  const wtokenBalanceOf = useSingleCallResult({
    abi: ERC20,
    functionName: 'balanceOf',
    address: DIALECT_ADDRESS,
    args: [WHITELIST_ADDRESS as Hash]
  });

  const totalSupply = useSingleCallResult({
    abi: ERC20,
    functionName: 'totalSupply',
    address: pairAddress?.result as never,
    args: []
  });

  const usdt = useMemo(() => {
    if (wlpBalanceOf?.result && totalSupply?.result) {
      return (
        (+formatEther(wlpBalanceOf.result as never) /
          +formatEther(totalSupply.result as never)) *
        +formatEther(resives0 as bigint)
      );
    }
    return '0';
  }, [wlpBalanceOf, resives0, totalSupply]);

  const [val, setVal] = useState('');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target && /^\d{0,9}(?:\.\d{0,6})?$/.test(e.target.value)) {
        setVal(e.target.value);
      }
    },
    [setVal]
  );

  const onChange1 = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target && /^\d{0,9}(?:\.\d{0,6})?$/.test(e.target.value)) {
        setVal1(e.target.value);
      }
    },
    [setVal1]
  );

  const onChange2 = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setVal2(e.target.value);
    },
    [setVal2]
  );

  const whiteBtnStatus = useMemo(() => {
    if (!val2) {
      return {
        disabled: true,
        text: '设置'
      };
    }
    if (!isAddress(val2)) {
      return {
        disabled: true,
        text: '地址不合法'
      };
    }
    if (WHITELIST_ADDRESS_LST.includes(val2)) {
      return {
        disabled: true,
        text: '当前地址不能为白名单地址'
      };
    }

    return {
      disabled: false,
      text: '设置'
    };
  }, [val2]);

  const updateTxStatux = useUpdateTxModalStatus();

  const { writeContractAsync } = useWriteContract();

  const handleBtn = useCallback(async () => {
    try {
      updateTxStatux({
        status: 'pending'
      });
      await writeContractAsync({
        address: pairAddress.result as never,
        abi: ERC20,
        functionName: 'transfer',
        args: [WHITELIST_ADDRESS, parseEther(val)]
      });
      updateTxStatux({
        status: 'success'
      });
      setVal('');
    } catch (error) {
      console.log(error);

      setVal('');
      updateTxStatux({
        status: 'fail'
      });
    }
  }, [updateTxStatux, setVal, pairAddress, writeContractAsync, val]);

  const handleBtn1 = useCallback(async () => {
    try {
      updateTxStatux({
        status: 'pending'
      });
      await writeContractAsync({
        address: DIALECT_ADDRESS as never,
        abi: ERC20,
        functionName: 'transfer',
        args: [WHITELIST_ADDRESS, parseEther(val1)]
      });
      updateTxStatux({
        status: 'success'
      });
      setVal1('');
    } catch (error) {
      console.log(error);

      setVal1('');
      updateTxStatux({
        status: 'fail'
      });
    }
  }, [updateTxStatux, setVal1, writeContractAsync, val1]);

  const handleClouseWhiteAddress = useCallback(async () => {
    setLoading1(true);
    try {
      updateTxStatux({
        status: 'pending'
      });
      const hash = await writeContractAsync({
        address: DIALECT_ADDRESS as never,
        abi: ERC20,
        functionName: 'setMarketer',
        args: [WHITELIST_ADDRESS as Hash]
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      setLoading1(false);
      updateTxStatux({
        status: 'success'
      });
    } catch (error) {
      console.log(error);
      setLoading1(false);
      updateTxStatux({
        status: 'fail'
      });
    }
  }, [updateTxStatux, writeContractAsync, publicClient]);

  const handleSetWhiteAddress = useCallback(async () => {
    setLoading2(true);
    try {
      updateTxStatux({
        status: 'pending'
      });
      const args = {
        abi: ERC20,
        functionName: 'setMarketer',
        args: [val2 as Hash]
      } as const;
      let hash = await writeContractAsync({
        address: DIALECT_ADDRESS as never,
        ...args
      });
      await publicClient?.waitForTransactionReceipt({ hash });

      hash = await writeContractAsync({
        address: BUY_SELL_ADDRESS as never,
        ...args
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      hash = await writeContractAsync({
        address: MINT_ADDRESS as never,
        ...args,
        abi: QUOTA_ABI,
        functionName: 'setVendor'
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      setLoading2(false);
      setVal2('');
      updateTxStatux({
        status: 'success'
      });
    } catch (error) {
      console.log(error);
      setLoading2(false);
      setVal2('');
      updateTxStatux({
        status: 'fail'
      });
    }
  }, [updateTxStatux, writeContractAsync, setVal2, val2, publicClient]);

  return (
    <Box>
      <Box>
        <Header />
      </Box>
      {address && isAddressEqual(address as Hash, RECHARGE_ADDRESS) ? (
        <Box
          fontSize={'sm'}
          pt={20}
          px={4}
        >
          <Box>
            <Flex
              border={'1px'}
              borderRadius={'lg'}
              flexDir={'column'}
              gap={4}
              p={2}
            >
              <Flex whiteSpace={'nowrap'}>白名单:</Flex>
              <Box>{WHITELIST_ADDRESS}</Box>
              <Flex whiteSpace={'nowrap'}>
                LP余额:
                {formatNumber(
                  formatEther((wlpBalanceOf?.result as never) || 0n)
                )}{' '}
                ({formatNumber(`${usdt}`)} USDT)
              </Flex>
              <Flex whiteSpace={'nowrap'}>
                {TOKEN_SYMBOL}余额:
                {formatNumber(
                  formatEther((wtokenBalanceOf?.result as never) || 0n)
                )}
              </Flex>
            </Flex>

            <Box mt={4}>
              <Input
                _focusVisible={{
                  outline: 'none'
                }}
                border={'1px'}
                onChange={onChange}
                pl={4}
                placeholder="0.000000"
                value={val}
                w={'full'}
              />
              <Box mt={4}>
                LP 余额：{formatEther((lpBalanceOf?.result as never) || 0n)}
              </Box>
              <Button
                colorScheme="yellow"
                isDisabled={
                  !+val ||
                  +val > +formatEther((lpBalanceOf?.result as never) || 0n)
                }
                mt={4}
                onClick={handleBtn}
                variant={'solid'}
              >
                转账 LP
              </Button>
            </Box>

            <Box mt={4}>
              <Input
                _focusVisible={{
                  outline: 'none'
                }}
                border={'1px'}
                onChange={onChange1}
                pl={4}
                placeholder="0.000000"
                value={val1}
                w={'full'}
              />
              <Box mt={4}>
                {TOKEN_SYMBOL} 余额：
                {formatEther((tokenBalanceOf?.result as never) || 0n)}
              </Box>
              <Button
                colorScheme="yellow"
                isDisabled={
                  !+val1 ||
                  +val1 > +formatEther((tokenBalanceOf?.result as never) || 0n)
                }
                mt={4}
                onClick={handleBtn1}
                variant={'solid'}
              >
                转账 {TOKEN_SYMBOL}
              </Button>
            </Box>

            <Box mt={4}>
              <Box>白名单地址开关：{WHITELIST_ADDRESS}</Box>
              <Button
                colorScheme="yellow"
                isDisabled={isMarketer ? false : true}
                isLoading={loading1}
                mt={4}
                onClick={handleClouseWhiteAddress}
                variant={'solid'}
              >
                {isMarketer ? '关闭' : '已关闭'}
              </Button>
            </Box>

            <Box mt={4}>
              <Box>设置新{TOKEN_SYMBOL},买卖交易,额度升级合约白名单地址：</Box>
              <Input
                _focusVisible={{
                  outline: 'none'
                }}
                border={'1px'}
                mt={4}
                onChange={onChange2}
                pl={4}
                placeholder="0x"
                value={val2}
                w={'full'}
              />
              <Button
                colorScheme="yellow"
                isDisabled={whiteBtnStatus?.disabled}
                isLoading={loading2}
                mb={10}
                mt={4}
                onClick={handleSetWhiteAddress}
                variant={'solid'}
              >
                {whiteBtnStatus?.text}
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Rechage;
