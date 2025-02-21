import { ChainId, DECIMAL } from '@/constants';

export function toFixedDown(num: number | string, decimals = 2): string {
  const isString = typeof num === 'string';
  if (isString) {
    num = Number(num);
  }
  if (!num) return Number(num || 0).toFixed(decimals);
  const multiplier = 10 ** (decimals - 3);
  const result =
    Math.floor((num as number) * 1000 * multiplier) / (multiplier * 10 ** 3);
  return result.toFixed(decimals);
}

export function formateAddress(address: string): string {
  if (address.length < 8) {
    return address;
  }
  return `${address.substring(0, 4)}...${address.substring(
    address.length - 4
  )}`;
}

export function truncateString(str: string): string {
  if (!str) return '';
  if (str.length <= 20) {
    return str;
  } else {
    const frontPart = str.slice(0, 6);
    const endPart = str.slice(-4);
    return frontPart + '....' + endPart;
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  97: 'testnet.bscscan.com',
  65: '',
  66: '',
  56: 'bscscan.com'
};

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address'
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
  }`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

export function formatNumber(
  str: string,
  isCommas?: boolean,
  decimal?: number
): string {
  if (!str || !+str) return '0';
  const [left, right] = `${str}`.split('.');

  const num = parseFloat(
    `${left}${right ? '.' + right.slice(0, decimal || DECIMAL) : ''}`
  )
    .toFixed(decimal || DECIMAL)
    .replace(/\.?0+$/, '');
  if (isCommas) {
    const [_left, _right] = num.split('.');
    const formattedLeft = formatNumberWithCommas(_left);
    return `${formattedLeft}${_right ? '.' + _right : ''}`;
  }

  return num;
}

export const formatNumberWithCommas = (num: number | string): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function formatNumberToK(num?: string): string {
  if (!num || !+num) return '0';
  if (+num < 1000) {
    return formatNumber(num.toString());
  } else if (+num < 1000000) {
    const kValue = +num / 1000;
    return kValue.toFixed(2) + 'k';
  } else if (+num < 1000000000) {
    const mValue = +num / 1000000;
    return mValue.toFixed(2) + 'M';
  } else {
    const mValue = +num / 1000000000;
    return mValue.toFixed(2) + 'B';
  }
}

// export function formatNumberWithCommas(number: number | string): string {
//   return Number(number).toLocaleString(
//     'en-US'
//     // , { maximumFractionDigits: 2 }
//   );
// }
