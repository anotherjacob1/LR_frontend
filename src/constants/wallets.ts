import { ChainId } from '@sushiswap/sdk';

export const RPC = {
  [ChainId.MAINNET]:
    'https://mainnet.infura.io/v3/70ebb0ee52064f96860e93596c9ca11d',
  [ChainId.ROPSTEN]:
    'https://ropsten.infura.io/v3/70ebb0ee52064f96860e93596c9ca11d',
  [ChainId.RINKEBY]:
    'https://rinkeby.infura.io/v3/70ebb0ee52064f96860e93596c9ca11d',
  [ChainId.GÖRLI]:
    'https://goerli.infura.io/v3/70ebb0ee52064f96860e93596c9ca11d',
  [ChainId.KOVAN]:
    'https://kovan.infura.io/v3/70ebb0ee52064f96860e93596c9ca11d',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]:
    'https://polygon-mainnet.infura.io/v3/70ebb0ee52064f96860e93596c9ca11d',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
};

const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;
const PORTIS_KEY = process.env.REACT_APP_PORTIS_KEY;

const APP_URL = 'https://looksrare.com';
const CONTACT_EMAIL = 'dev@looksrare.com';
const APP_NAME = 'Looks Rare';

const wallets = (chainId: number) => {
  const RPC_URL = RPC[chainId as keyof typeof RPC];

  if (chainId === 56 || chainId === 137) {
    return [
      { walletName: 'metamask', preferred: true },
      {
        walletName: 'walletConnect',
        preferred: true,
        rpc: {
          1: RPC[ChainId.MAINNET],
          4: RPC[ChainId.RINKEBY],
          42: RPC[ChainId.KOVAN],
          56: RPC[ChainId.BSC],
          137: RPC[ChainId.MATIC],
        },
      },
    ];
  }

  return [
    { walletName: 'coinbase', preferred: true },
    {
      walletName: 'trust',
      preferred: true,
      rpcUrl: RPC_URL,
    },
    { walletName: 'metamask', preferred: true },
    { walletName: 'authereum' },
    {
      walletName: 'trezor',
      appUrl: APP_URL,
      email: CONTACT_EMAIL,
      rpcUrl: RPC_URL,
    },
    {
      walletName: 'ledger',
      rpcUrl: RPC_URL,
    },
    {
      walletName: 'lattice',
      rpcUrl: RPC_URL,
      appName: APP_NAME,
    },
    {
      walletName: 'fortmatic',
      preferred: true,
      apiKey: FORTMATIC_KEY,
    },
    {
      walletName: 'walletConnect',
      preferred: true,
      rpc: {
        1: RPC[ChainId.MAINNET],
        4: RPC[ChainId.RINKEBY],
        42: RPC[ChainId.KOVAN],
        56: RPC[ChainId.BSC],
        137: RPC[ChainId.MATIC],
      },
    },
    {
      walletName: 'portis',
      apiKey: PORTIS_KEY,
      label: 'Portis',
    },
    { walletName: 'opera' },
    { walletName: 'operaTouch' },
    { walletName: 'torus' },
    { walletName: 'status' },
    {
      walletName: 'walletLink',
      rpcUrl: RPC_URL,
      appName: APP_NAME,
    },
    { walletName: 'imToken', rpcUrl: RPC_URL },
    { walletName: 'meetone' },
    { walletName: 'mykey', rpcUrl: RPC_URL },
    {
      walletName: 'huobiwallet',
      rpcUrl: RPC_URL,
    },
    { walletName: 'hyperpay' },
    { walletName: 'wallet.io', rpcUrl: RPC_URL },
    { walletName: 'atoken' },
  ];
};

export default wallets;
