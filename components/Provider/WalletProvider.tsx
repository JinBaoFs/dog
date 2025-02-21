import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { RainbowKitProviderProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider';
import { PropsWithChildren } from 'react';
import merge from 'lodash.merge';
// import { useRouter } from 'next/router';

export const WalletProvider = ({
  children,
  ...rainbowProps
}: RainbowKitProviderProps & PropsWithChildren) => {
  return (
    <RainbowKitProvider
      theme={merge(lightTheme(), {
        colors: {}
      })}
      {...rainbowProps}
    >
      {children}
    </RainbowKitProvider>
  );
};
