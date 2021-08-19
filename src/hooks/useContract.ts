import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { ChainId } from '@sushiswap/sdk';

import {
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
  MULTICALL_NETWORKS,
} from 'constants/contracts';
import {
  ArgentWalletDetectorAbi,
  MultiCallAbi,
  EnsPublicResolverAbi,
  EnsRegistrarAbi,
  Erc20Bytes32Abi,
  Erc20Abi,
} from 'constants/abi';
import { Erc20 as Erc20Contract } from 'contracts';
import { useWeb3 } from 'state/application/hooks';
import { getContract } from 'utils';

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): Contract | null {
  const { web3, account } = useWeb3();

  return useMemo(() => {
    if (!address || !ABI || !web3) return null;
    try {
      return getContract(
        address,
        ABI,
        web3,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, web3, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible: boolean = true,
): Erc20Contract | null {
  return useContract(
    tokenAddress,
    Erc20Abi,
    withSignerIfPossible,
  ) as Erc20Contract;
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useWeb3();
  return useContract(
    chainId === ChainId.MAINNET
      ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
      : undefined,
    ArgentWalletDetectorAbi,
    false,
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible: boolean = true,
): Contract | null {
  const { chainId } = useWeb3();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
        break;
    }
  }
  return useContract(address, EnsRegistrarAbi, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible: boolean = true,
): Contract | null {
  return useContract(address, EnsPublicResolverAbi, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible: boolean = true,
): Contract | null {
  return useContract(tokenAddress, Erc20Bytes32Abi, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useWeb3();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MultiCallAbi,
    false,
  );
}
