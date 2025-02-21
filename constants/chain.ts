import { Chain } from '@rainbow-me/rainbowkit';

export const NERUALAND_TEST_CHAIN = {
  id: 4428,
  name: 'NeuraLand Chain',
  iconUrl: '/assets/img/NEC.png',
  nativeCurrency: {
    decimals: 18,
    name: 'NEC',
    symbol: 'NEC'
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.neura.land'] }
  },
  blockExplorers: {
    default: {
      name: 'NeruaLandScan',
      url: 'http://18.216.28.13:3001',
      apiUrl: 'http://18.216.28.13:3001/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0x535dEC83dfB88A56Ee2383d77187e936ff6184d5'
    }
  },
  testnet: true
} as const satisfies Chain;

export const NERUALAND_CHAIN = {
  id: 4429,
  name: 'NeuraLand Chain',
  iconUrl: '/assets/img/NEC.png',
  nativeCurrency: {
    decimals: 18,
    name: 'NEC',
    symbol: 'NEC'
  },
  rpcUrls: {
    default: { http: ['https://rpc.neura.land'] }
  },
  blockExplorers: {
    default: {
      name: 'NeruaLandScan',
      url: 'https://necscan.neura.land',
      apiUrl: 'https://necscan.neura.land/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0x0266A63cE4aEEE202AbD01C201876D7A1d861032'
    }
  },
  testnet: true
} as const satisfies Chain;
