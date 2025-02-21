import { Hash } from 'viem';
import { ChakraStylesConfig } from 'chakra-react-select';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { parseEther } from 'viem';
import { ENV_KEY_TYPE } from '@/types/global';

export const MAX_UNIT256 = BigInt(
  '57896044618658097711785492504343953926634992332820282019728792003956564819967'
);

export const APPROVE_AMOUNT = BigInt(100000000000 * Math.pow(10, 18));
export const ENV_KEY = process.env.NEXT_PUBLIC_ENV_KEY as ENV_KEY_TYPE;

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSCMAINNET = 56,
  BSCTESTNET = 97,
  OKEX = 66,
  OKEX_TESTNET = 65
}

export enum AUTHTYPE {
  NOAUTH = 0,
  AUTHING = 1,
  AUTH = 2
}

export enum ASSET_STATUS {
  PRE_SALE = 1,
  SALE = 2
}

export enum BTCChainType {
  LIVENET = 'livenet',
  TESTNET = 'testnet'
}

export const GAS_FEE = parseEther('0.002');
export const TOKEN_SYMBOL = 'DLW';
export const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS as Hash;
export const DIALECT_ADDRESS = process.env.NEXT_PUBLIC_DIALECT_ADDRESS as Hash;
export const BUY_SELL_ADDRESS = process.env
  .NEXT_PUBLIC_BUY_SELL_ADDRESS as Hash;
export const MINT_ADDRESS = process.env.NEXT_PUBLIC_MINT_ADDRESS as Hash;
export const POOL_ADDRESS = process.env.NEXT_PUBLIC_MINT_POOL_ADDRESS as Hash;
export const FACTORY_address = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Hash;
export const RECHARGE_ADDRESS = process.env.NEXT_PUBLIC_RECHAGE_ADDRESS as Hash;
export const WHITELIST_ADDRESS = process.env
  .NEXT_PUBLIC_WHITELIST_ADDRESS as Hash;

export const DECIMAL = 6;

export const datePickerPropsConfig: PropsConfigs = {
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      color: 'white',
      _hover: {
        background: 'gray.700',
        color: 'white',
        borderRadius: '0'
      }
    },
    isInRangeBtnProps: {
      background: 'black.200',
      color: 'white',
      borderRadius: '0'
    },
    selectedBtnProps: {
      background: 'gray.700',
      borderRadius: '0',
      color: 'white'
    }
  },
  dateNavBtnProps: {
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'transparent',
    color: 'white',
    _hover: {
      border: '1px solid',
      borderColor: 'black.400'
    },
    _focus: {
      bg: 'black.400'
    }
  },
  inputProps: {
    w: { base: 'full', md: '240px' },
    h: '40px',
    color: 'white',
    size: 'sm',
    border: '1px solid',
    padding: '4',
    borderColor: 'black.500',
    bg: 'gray.900',
    transitionDuration: 'normal',
    borderRadius: 'lg',
    placeholder: 'Select date range',
    _placeholder: {
      color: 'white'
    },
    _focusVisible: {
      borderColor: 'gray.300'
    }
  },
  popoverCompProps: {
    popoverContentProps: {
      zIndex: 'tooltip',
      color: 'white',
      bg: 'gray.900',
      borderColor: 'black.400'
    }
  },
  calendarPanelProps: {
    wrapperProps: {
      borderColor: 'red'
    },
    contentProps: {
      borderWidth: '0'
    },
    headerProps: {
      padding: '5px'
    },
    dividerProps: {
      display: 'none'
    }
  },
  weekdayLabelProps: {
    fontWeight: 'normal',
    mb: '4px'
  },
  dateHeadingProps: {
    fontWeight: 'semibold'
  }
};

export const chakraStyles: ChakraStylesConfig = {
  container: provided => {
    return {
      ...provided,
      bg: 'gray.900',
      border: '1px solid',
      borderColor: 'black.500',
      borderRadius: 'lg',
      w: { base: 'full', md: '184px' },
      transitionDuration: 'normal',
      _hover: {
        borderColor: 'gray.300'
      }
    };
  },
  control: provided => {
    return {
      ...provided,
      px: '4',
      borderColor: 'transparent',
      _focusVisible: {
        outline: 'none'
      }
    };
  },
  placeholder: provided => {
    return {
      ...provided,
      color: 'white'
    };
  },
  valueContainer: provided => {
    return {
      ...provided,
      pl: 4,
      color: 'white'
    };
  },
  menuList: provided => {
    return {
      ...provided,
      bg: 'gray.900',
      border: 'none',
      p: 2,
      py: 1,
      px: 2
    };
  },
  option: (provided, state) => {
    return {
      ...provided,
      borderRadius: 'lg',
      bg:
        state.isFocused || state.isSelected ? 'black.300' : provided.background,
      mb: 1,
      color: 'white'
    };
  },
  dropdownIndicator: provided => {
    return {
      ...provided,
      p: 0
    };
  }
};
