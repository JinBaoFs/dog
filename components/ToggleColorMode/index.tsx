'use client';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { Flex, useConst, useColorMode } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import ChakraMotionBox from '../ChakraMotionBox';

const ToggleColorMode = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  // console.log(colorMode);

  const variants = useConst({
    tap: {
      width: '40px'
    }
  });

  const isOn = useMemo(() => colorMode === 'light', [colorMode]);

  return (
    <Flex
      alignItems={'center'}
      borderRadius={'50px'}
      className={isOn ? 'toggle' : 'toggle-dark'}
      cursor={'pointer'}
      h={'50px'}
      px={'5px'}
      transition={'2s'}
      w={'100px'}
    >
      <ChakraMotionBox
        alignItems={'center'}
        display={'flex'}
        flex={1}
        h={'100%'}
        justifyContent={isOn ? 'flex-start' : 'flex-end'}
        onClick={() => {
          toggleColorMode();
        }}
        w={'100%'}
        whileTap="tap"
      >
        <ChakraMotionBox
          bg={'#fff'}
          borderRadius={'30px'}
          display={'flex'}
          h={'30px'}
          justifyContent={isOn ? 'none' : 'flex-end'}
          layout
          overflow={'hidden'}
          // @ts-ignore
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          variants={variants}
          w={'30px'}
        >
          <AnimatePresence
            initial={false}
            mode="wait"
          >
            <ChakraMotionBox
              alignItems={'center'}
              animate={{ y: 0, opacity: 1 }}
              display={'flex'}
              exit={{ y: isOn ? -30 : 30, opacity: 0 }}
              h={'30px'}
              initial={{ y: isOn ? 30 : -30, opacity: 0 }}
              justifyContent={'center'}
              key={isOn ? 'sun' : 'moon'}
              pos={'relative'}
              w={'30px'}
            >
              {isOn ? (
                <SunIcon color={'#f88748'} />
              ) : (
                <MoonIcon color={'#501a96'} />
              )}
            </ChakraMotionBox>
          </AnimatePresence>
        </ChakraMotionBox>
      </ChakraMotionBox>
    </Flex>
  );
};

export default ToggleColorMode;
