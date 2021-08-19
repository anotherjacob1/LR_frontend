import { ethers } from 'ethers';

export enum ContractType {}

export type ContractAddresses = {
  [key in ContractType]: { [chainId: number]: string };
};

export interface LooksRareContracts {}

export const contracts: ContractAddresses = {};

export function getContractAddress(
  chainId: number,
  contractType: ContractType,
) {
  return contracts[contractType][chainId] ?? '';
}

export async function getSignerAndContracts(
  web3Provider: ethers.providers.Web3Provider,
) {
  const signer = web3Provider.getSigner();
  const network = await web3Provider.getNetwork();
  const chainId = network.chainId;

  const contracts: LooksRareContracts = {};

  return { contracts, signer, chainId };
}
