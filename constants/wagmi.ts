import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  // walletConnectWallet,
  metaMaskWallet,
  trustWallet,
  argentWallet
} from '@rainbow-me/rainbowkit/wallets';
import { bsc, bscTestnet } from 'viem/chains';
// import { NERUALAND_CHAIN } from './chain';
import { ENV_KEY } from '.';

export const config = getDefaultConfig({
  appName: 'SnowballRWA',
  projectId: '7748b82ece2b86510b629efd07bb877a',
  chains: [ENV_KEY === 'production' ? bsc : bscTestnet],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        // walletConnectWallet,
        rainbowWallet
      ]
    },
    {
      groupName: 'Other',
      wallets: [trustWallet, argentWallet]
    }
  ],
  ssr: true
});
