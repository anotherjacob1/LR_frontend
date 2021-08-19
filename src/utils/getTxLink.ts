import { ChainId } from '@sushiswap/sdk';

export function getTxLink(
  txHash: string,
  chainId: ChainId | 56 | 137 | undefined,
): string {
  switch (chainId) {
    case 137:
      return `https://polygonscan.com/tx/${txHash}`;

    case 56:
      return `https://bscscan.com/tx/${txHash}`;

    case ChainId.KOVAN:
      return `https://kovan.etherscan.io/tx/${txHash}`;

    case ChainId.RINKEBY:
      return `https://rinkeby.etherscan.io/tx/${txHash}`;

    case ChainId.MAINNET:
    default:
      return `https://etherscan.io/tx/${txHash}`;
  }
}
