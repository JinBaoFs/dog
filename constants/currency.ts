import { ChainId } from './';

export class Currency {
  public readonly decimals: number;
  public readonly symbol?: string;
  public readonly name?: string;

  public static readonly ETHERCurrency: Currency = new Currency(
    18,
    'ETH',
    'Ether'
  );
  public static readonly BNBCurrency: Currency = new Currency(
    18,
    'BNB',
    'Binance'
  );
  public static readonly GDCurrency: Currency = new Currency(
    18,
    'GDC',
    'GDCChain'
  );
  public static readonly OKTCurrency: Currency = new Currency(
    18,
    'OKT',
    'OKExChain'
  );
  public static ETHER: Currency;

  public static readonly ENATIVE: { [chainId in ChainId]: Currency } = {
    [ChainId.MAINNET]: Currency.ETHERCurrency,
    [ChainId.KOVAN]: Currency.ETHERCurrency,
    [ChainId.RINKEBY]: Currency.ETHERCurrency,
    [ChainId.ROPSTEN]: Currency.ETHERCurrency,
    [ChainId.GÖRLI]: Currency.ETHERCurrency,
    [ChainId.BSCMAINNET]: Currency.BNBCurrency,
    [ChainId.BSCTESTNET]: Currency.BNBCurrency,
    [ChainId.OKEX]: Currency.OKTCurrency,
    [ChainId.OKEX_TESTNET]: Currency.OKTCurrency
  };

  protected constructor(decimals: number, symbol?: string, name?: string) {
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }

  public static getCurrentChainIdCurrency(chainId?: ChainId): Currency {
    const storedChainId = 97; //localStorage.getItem('chainId');
    const _chainId =
      chainId ||
      (storedChainId &&
      Object.values(ChainId).includes(+storedChainId as ChainId)
        ? (+storedChainId as ChainId)
        : 97);
    return Currency.ENATIVE[_chainId];
  }
}
Currency.ETHER = Currency.getCurrentChainIdCurrency();

const ETHER = Currency.ETHER;
export { ETHER };
