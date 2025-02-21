export const RWARouterABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'SCA',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdsAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256'
      }
    ],
    name: 'ExtractUSDS',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'ECA',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdtAmount',
        type: 'uint256'
      }
    ],
    name: 'ExtractUSDT',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'ECA',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'Pledge',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'ECA',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'RedeemToken',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'SCA',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdsAmount',
        type: 'uint256'
      }
    ],
    name: 'RedeemUSDS',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'SCA',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdsAmount',
        type: 'uint256'
      }
    ],
    name: 'SubscriptionAndPledge',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sca',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'usdsAmount',
        type: 'uint256'
      }
    ],
    name: 'extractUSDS',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'eca',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'usdtAmount',
        type: 'uint256'
      }
    ],
    name: 'extractUSDT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'eca',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'getIncome',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sca',
        type: 'address'
      }
    ],
    name: 'getResource',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sca',
        type: 'address'
      }
    ],
    name: 'getSCInfo',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      },
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      },
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sca',
        type: 'address'
      }
    ],
    name: 'getSubscriptionSurplus',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'eca',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'pledge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'eca',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'pledgeOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'eca',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'redeemToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sca',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'redeemUSDS',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sca',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'eca',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'usdsAmount',
        type: 'uint256'
      }
    ],
    name: 'subscriptionAndPledge',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
