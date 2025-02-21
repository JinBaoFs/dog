'use client';
import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Home from './Home';
// import Vconsole from 'vconsole';
// import USDSPage from './usds/pageContent';

export default function Page() {
  useEffect(() => {
    // localStorage.removeItem('wagmi.store');
    // if (typeof window !== 'undefined') {
    //   process.env.NEXT_PUBLIC_ENV_KEY !== 'production' && new Vconsole();
    // }
  }, []);

  // redirect('/usds');

  return (
    <Box>
      <Home />
    </Box>
  );
}
