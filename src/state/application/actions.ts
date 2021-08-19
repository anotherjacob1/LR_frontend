import { createAction } from '@reduxjs/toolkit';
import { ChainId } from '@sushiswap/sdk';
import { API, Wallet } from 'bnc-onboard/dist/src/interfaces';
import { ethers } from 'ethers';

import { LooksRareContracts } from 'web3/contracts';

export enum ApplicationModal {
  TransactionLoading = 'TransactionLoading',
  TransactionSuccess = 'TransactionSuccess',
  TransactionFailed = 'TransactionFailed',
  TransactionCancelled = 'TransactionCancelled',
}

export interface SetWeb3Settings {
  onboard?: API;
  ethereum?: any;
  account?: string;
  balance?: string;
  signer?: ethers.Signer;
  contracts?: LooksRareContracts;
  chainId?: ChainId;
  web3?: ethers.providers.Web3Provider | null;
  wallet?: Wallet | null;
}

export const updateBlockNumber = createAction<number>(
  'application/updateBlockNumber',
);

export const setWeb3Settings = createAction<SetWeb3Settings>(
  'application/setWeb3Settings',
);

export const setActiveModal = createAction<ApplicationModal | null>(
  'application/setActiveModal',
);
