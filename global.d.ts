import { Hash } from 'viem';

declare module '*.svg?url';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: true;
      on?: (...args: any[]) => void;
      removeListener?: (...args: any[]) => void;
      isCoinbaseWallet: true;
      selectedAddress: Hash;
    };
    unisat?: any;
  }
}
