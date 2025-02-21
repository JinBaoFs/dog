import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  // walletConnectWallet,
  metaMaskWallet,
  trustWallet,
  argentWallet
} from '@rainbow-me/rainbowkit/wallets';
// import { bscTestnet } from 'viem/chains';
import { NERUALAND_CHAIN } from './chain';

export const config = getDefaultConfig({
  appName: 'SnowballRWA',
  projectId: '7748b82ece2b86510b629efd07bb877a',
  chains: [NERUALAND_CHAIN],
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
