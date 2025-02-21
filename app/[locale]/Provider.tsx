'use client';
import React, { PropsWithChildren } from 'react';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, useToast } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Locale } from '@rainbow-me/rainbowkit';
import { ColorModeScript } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import { useParams } from 'next/navigation';
// import { isAddressEqual, getAddress, Hash } from 'viem';
import { config } from '@/constants/wagmi';
import theme from '@/theme/themeConfig';
import Popup from '@/components/Popup';
import { useIsMounted } from '@/hooks/useIsMounted';
import TransactionUpdater from '@/state/transactions/TransactionsUpdater';
import ApplicationUpdater from '@/state/application/ApplicationUpdater';
import MulticallUpdater from '@/state/multicall/MulticallUpdater';
import fomaterDataMiddleware from '@/lib/fomaterDataMiddleware';
import { useUserSignOut } from '@/state/userInfo/hook';
// import { useUserSignMessageIn } from '@/hooks/userSignMessage';
import { WalletProvider } from '@/components/Provider';
import store from '../../state';

const AuthProvider = ({ children }: PropsWithChildren) => {
  // useUserSignMessageIn();
  return <>{children}</>;
};

const SwrProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();
  const userSignOut = useUserSignOut();
  return (
    <SWRConfig
      value={{
        use: [fomaterDataMiddleware],
        onError: error => {
          toast({
            position: 'top',
            title: error.message,
            status: 'error'
          });
        },
        onSuccess: (data, key) => {
          const _data = key.indexOf('$inf$') !== -1 ? data[0] : data;
          if (_data && _data.status !== 200 && _data.status !== 40000) {
            toast({
              position: 'top',
              title: _data.message,
              status: 'error'
            });
          }
          if (_data && _data.status === 40000) {
            toast({
              position: 'top',
              title: _data.message,
              status: 'error'
            });
            userSignOut();
            return;
          }
        }
      }}
    >
      {children}
    </SWRConfig>
  );
};

const Provider = ({
  children,
  session
}: // initialState
//
{
  children: React.ReactNode;
  // initialState: State | undefined;
  session: any;
}) => {
  const isMounted = useIsMounted();
  const { locale } = useParams() as { locale: Locale };

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000
          }
        }
      })
  );

  return (
    <CacheProvider>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: 'top'
          }
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ReduxProvider store={store}>
              <ApplicationUpdater />
              <MulticallUpdater />
              {isMounted && <Popup />}
              <WalletProvider
                initialChain={config.chains[0]}
                locale={locale}
                modalSize="wide"
                showRecentTransactions={false}
              >
                <TransactionUpdater />
                <SwrProvider>
                  {/* {children} */}
                  <SessionProvider session={session}>
                    <AuthProvider>{children}</AuthProvider>
                  </SessionProvider>
                  {/* <SessionProvider session={session}>{children}</SessionProvider> */}
                </SwrProvider>
              </WalletProvider>
            </ReduxProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
      <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
      ></ColorModeScript>
    </CacheProvider>
  );
};

export default Provider;
