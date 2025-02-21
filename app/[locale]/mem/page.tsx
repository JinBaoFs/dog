'use client';
import { Box, Button, Input, useDisclosure } from '@chakra-ui/react';
import { generateMnemonic, english, privateKeyToAccount } from 'viem/accounts';
import { ethers } from 'ethers';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Hash } from 'viem';

const Rechage = () => {
  const [address, setAddress] = useState('');
  const [address1, setAddress1] = useState('');
  const [index, setIndex] = useState<null | number>(null);
  const [pre, setPre] = useState('');
  const [end, setEnd] = useState('');

  const [pre1, setPre1] = useState('');
  const [end1, setEnd1] = useState('');

  const { isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    const mm = generateMnemonic(english);
    const _mm = ethers.Wallet.fromMnemonic(mm);
    const pri = _mm.privateKey;
    // console.log(pri);

    setPre(pri.slice(0, 33));
    setEnd(pri.slice(33));
    setAddress(_mm.address);
  }, [setAddress, setPre, setEnd]);

  const handle = useCallback(() => {
    if (index === 1) {
      onOpen();
      return;
    }
    setIndex(index === null ? 0 : 1);
  }, [index, onOpen, setIndex]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPre1(e.target.value);
    },
    [setPre1]
  );

  const onChange1 = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEnd1(e.target.value);
    },
    [setEnd1]
  );
  const getAddress = useCallback(() => {
    const account = privateKeyToAccount(`${pre1}${end1}` as Hash);
    console.log(account.address);
    setAddress1(account.address);
  }, [setAddress1, pre1, end1]);

  return (
    <Box p={4}>
      <Box fontSize={'xs'}>address:{address}</Box>
      {!isOpen ? (
        <>
          <Box my={'50px'}>
            {index !== null && <Box>{index ? end : pre}</Box>}
          </Box>
          {index === 1 ? (
            <Button
              colorScheme="yellow"
              onClick={handle}
              variant={'solid'}
            >
              验证钱包
            </Button>
          ) : (
            <Button
              colorScheme="yellow"
              onClick={handle}
              variant={'solid'}
            >
              查看第{index === null ? '1' : '2'}段秘钥
            </Button>
          )}
        </>
      ) : (
        <>
          <Box my={50}></Box>
          <Input
            border={'1px solid #fff'}
            mb={5}
            onChange={onChange}
            pl={2}
            placeholder="前段"
            type="password"
          />
          <Input
            border={'1px solid #fff'}
            mb={5}
            onChange={onChange1}
            pl={2}
            placeholder="后段"
            type="password"
          />
          <Box
            fontSize={'sm'}
            my={5}
          >
            {address1}
            {address1 && (
              <Box>{address1 === address ? '地址匹配' : '地址不匹配'}</Box>
            )}
          </Box>
          <Button
            colorScheme="yellow"
            onClick={getAddress}
            variant={'solid'}
          >
            派生钱包
          </Button>
        </>
      )}
    </Box>
  );
};

export default Rechage;
