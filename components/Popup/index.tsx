'use client';
import { Box, HStack, VStack, Button, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CloseButton } from '@chakra-ui/react';
import { useActivePopup } from '@/state/application/hooks';
import { useRemovePopup } from '@/state/application/hooks';

import { getEtherscanLink } from '@/lib';
import { ChainId } from '@/constants';
import ChakraMotionBox from '../ChakraMotionBox';

import IconSvg from '../IconSvg';
import { AnimateLine } from './AnimateLine';

const Column = {
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  gap: '10px',
  zIndex: 'tooltip'
};

const PopupBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      position="fixed"
      right={'8'}
      top={{
        md: '76px'
      }}
      {...Column}
    >
      {children}
    </Box>
  );
};

const Popup = () => {
  const activePopupList = useActivePopup();

  const removePopup = useRemovePopup();

  const removeThisPopup = useCallback(
    (index: number) => {
      removePopup({ key: activePopupList[index].key });
    },
    [removePopup, activePopupList]
  );

  return (
    <>
      <PopupBox>
        <AnimatePresence mode="popLayout">
          {activePopupList.map(({ key, ...info }, index) => (
            <ChakraMotionBox
              animate={{ scale: 1, opacity: 1, left: 0 }}
              custom={index}
              exit={{ scale: 0.8, opacity: 0 }}
              initial={{ left: '100vw', scale: 0.8, opacity: 0 }}
              key={key}
              layout
              // @ts-ignore
              transition={{ type: 'spring', duration: 1 }}
            >
              <Box
                background={'black.800'}
                borderRadius="lg"
                minH={'100px'}
                overflow={'hidden'}
                p={'4'}
                pos={'relative'}
                textAlign={'center'}
                w={'320px'}
              >
                <VStack gap={3}>
                  <HStack
                    color={
                      (info.content as any).txn.success
                        ? 'green.500'
                        : 'red.500'
                    }
                    w={'full'}
                  >
                    <IconSvg
                      boxSize={'4'}
                      name={
                        (info.content as any).txn.success ? 'success' : 'field'
                      }
                    />
                    <Text>{(info.content as any).txn.summary}</Text>
                  </HStack>
                  <Button
                    _active={{
                      bg: 'gray.900'
                    }}
                    _hover={{
                      bg: 'gray.900'
                    }}
                    bg={'gray.900'}
                    onClick={() =>
                      window.open(
                        getEtherscanLink(
                          process.env.NEXT_PUBLIC_ENV_KEY === 'production'
                            ? ChainId.BSCMAINNET
                            : ChainId.BSCTESTNET,
                          key,
                          'transaction'
                        )
                      )
                    }
                  >
                    View on BSC Explorer
                  </Button>
                </VStack>
                <CloseButton
                  onClick={() => removeThisPopup(index)}
                  position={'absolute'}
                  right={'0'}
                  top={0}
                />
                <AnimateLine
                  popKey={key}
                  removeAfterMs={info.removeAfterMs}
                />
              </Box>
            </ChakraMotionBox>
          ))}
        </AnimatePresence>
      </PopupBox>
    </>
  );
};

export default Popup;
