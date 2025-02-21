'use client';

import { Box } from '@chakra-ui/react';

//
const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      bg={'#000'}
      // bg={'url(/assets/img/bg.png) lightgray 0px -546.781px / 397.6% 142.203% no-repeat'}
      height={{
        base: '100vh',
        md: '1200px'
      }}
      margin={'0 auto'}
      // margin={{
      //   base: 0,
      //   md: '100px auto',
      // }}
      maxW={'600px'}
      pos={'relative'}
      width="100%"
    >
      <Box
        bg={'#000'}
        height={{
          base: '100vh',
          md: '1200px'
        }}
        overflow={'hidden'}
        pos={'relative'}
      >
        <Box
          bg={'url(/assets/img/bg.png)'}
          bgRepeat={'repeat-y'}
          bgSize={'100% auto'}
          h={'full'}
          left={0}
          pos={'absolute'}
          top={0}
          w={'full'}
          zIndex={'0'}
        ></Box>
        <Box
          h={'full'}
          overflowY={'auto'}
          pos={'relative'}
          zIndex={1}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ContentContainer;
