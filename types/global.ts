import { Hash } from 'viem';
import { ASSET_STATUS } from '@/constants';

export interface TokenCardPorps {
  name: string;
  address?: Hash;
  icon?: string;
  hiddenNameOfPending?: boolean;
  hiddenConfirmItem?: boolean;
}

export interface PortfolioItemProps {
  tokenName: string;
  data: string;
  tip: string;
  name: string;
  icon: string;
}

export interface TransactionItemProps {
  from_coin: string;
  to_coin: string;
  from_logo: string;
  to_logo: string;
  id: number;
  uid: number;
  address: string;
  type: number;
  usdt: string;
  usds: string;
  create_time: string;
  hash: string;
  coin: string;
  cid: null;
}

export interface UserInfoType {
  spread_name: string;
  uid: number;
  address: Hash;
  nickname: string;
  status: number;
  level: number;
  lp_money: string;
  dog_money: string;
  usdt_money: string;
  reward_money: string;
  team_money: string;
  weight_money: string;
  limit_num: string;
  team_count: number;
  f_count: number;
  spread_count: number;
  history_dog: number;
  history_usdt: number;
}

export interface NFTDetail {
  id: number;
  contract: Hash;
  name: LEVEL;
  logo: string;
  update_time: string;
  price: number;
  order_sn: string;
  lp_num: number;
  limit_num: number;
  rate: number;
}

export interface UsdsDetail {
  usds_logo: string;
  usds_name: string;
  usds_contract: Hash;
  usdt_logo: string;
  usdt_name: string;
  usdt_contract: Hash;
  usds_about: string;
  usds_about_zh: string;
}

export interface ConfigProps {
  min_cast: string;
  min_pledge: string;
  min_redemption: string;
  min_withdraw: string;
  min_deposit: string;
}

export interface MarketItemProps {
  id: number;
  total_supply: number;
  price: string;
  rate: string;
  pledge_cycle: number;
  payout_cycle: number;
  start_time: string;
  expire_time: string;
  end_time: string;
  country: string;
}

export interface MarketListProps {
  count: number;
  list: MarketItemProps[];
}

export interface MarketDetailProps {
  percent: number;
  id: number;
  sale_num: string;
  total_supply: number;
  price: string;
  rate: string;
  pledge_cycle: number;
  payout_cycle: number;
  start_time: string;
  end_time: string;
  expire_time: string;
  type: ASSET_STATUS;
  soft_rate: number;
  hard_rate: number;
  logo: string;
  country: string;
  country_zh: string;
  contract: Hash;
  issuer_address: Hash;
  payout_address: Hash;
  sale_address: Hash;
  title: string;
  title_zh: string;
  describe: string;
  describe_zh: string;
  total_money: string;
  about: string;
  about_zh: string;
  files: File[];
  sale_rate: string;
  left_num: string;
  sale_status: number;
  symbol: string;
  banner: string;
}

interface File {
  name: string;
  path: string;
  time: number;
}

export interface AssetsListProps {
  count: number;
  list: AssetsItemProps[];
}

export interface AssetsItemProps {
  type: number;
  num: string;
  title: string;
  logo: string;
  sale_address: Hash;
  payout_address: Hash;
  symbol: string;
  rate: string;
  start_time: string;
  end_time: string;
  expire_time: string;
  think_count: number;
  sale_status: number;
  pledge_cycle: number;
  payout_cycle: number;
  price: string;
  contract: Hash;
  sale_num: string;
  total_supply: number;
  pledgeOf?: bigint;
  lx_fee: string;
}

export type ExchangeType = 'Stake' | 'Withdraw' | 'Deposit' | 'Collect';

export type ENV_KEY_TYPE = 'production' | 'develop' | 'test';

export interface ListData<T> {
  data: {
    list: T[];
  };
  status: number;
  message: string;
}

export interface ajaxData<T> {
  data: T;
  status: number;
  message: string;
}

export type TXStatus = 'pending' | 'success' | 'fail';

export type LEVEL = 'N' | 'R' | 'S' | 'SR' | 'SSR';

export type NFTTYPE = {
  id: number;
  name: LEVEL;
  logo: string;
  price: number;
  order_sn: string;
  lp_num: number;
};

export type NFTList = {
  list: NFTTYPE[];
};
