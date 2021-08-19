import Notify, { API as NotifyAPI } from 'bnc-notify';
import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces';
import { createReducer } from '@reduxjs/toolkit';
import { ChainId } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { Provider } from 'ethers-multicall';

import { LooksRareContracts } from 'web3/contracts';

import {
  ApplicationModal,
  setWeb3Settings,
  setActiveModal,
  updateBlockNumber,
} from './actions';

export interface ApplicationState {
  onboard?: OnboardAPI;
  notify: NotifyAPI;
  chainId?: ChainId | 56 | 137;
  blockNumber: number;
  ethereum: any;
  account: string;
  balance: string;
  signer?: ethers.Signer;
  web3?: ethers.providers.Web3Provider | null;
  multicallProvider?: Provider | null;
  wallet?: Wallet | null;
  activeModal?: ApplicationModal | null;
  contracts?: LooksRareContracts;
}

export const initialState: ApplicationState = {
  onboard: undefined,
  notify: Notify({
    dappId: process.env.REACT_APP_BLOCKNATIVE_KEY,
    networkId: ChainId.MAINNET,
  }),
  chainId: undefined,
  blockNumber: -1,
  ethereum: (window as any).ethereum,
  account: '',
  balance: '',
  signer: undefined,
  web3: undefined,
  wallet: undefined,
  activeModal: undefined,
  contracts: undefined,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, { payload: blockNumber }) => {
      state.blockNumber = blockNumber;
    })
    .addCase(setWeb3Settings, (state, { payload }) => {
      const {
        onboard,
        ethereum,
        account,
        balance,
        signer,
        web3,
        wallet,
        contracts,
        chainId,
      } = payload;

      state.onboard = onboard || state.onboard;
      state.ethereum = ethereum || state.ethereum;
      state.account = account ? account.toLowerCase() : state.account;
      state.balance = balance ? balance : state.balance;
      state.signer = signer || state.signer;
      state.web3 = web3 !== undefined ? web3 : state.web3;
      state.wallet = wallet !== undefined ? wallet : state.wallet;
      state.contracts = (contracts as any) || state.contracts;
      state.chainId = chainId ?? state.chainId;

      if (state.web3) {
        state.multicallProvider = new Provider(state.web3, state.chainId);
      }

      state.notify.config({ networkId: Number(chainId) });

      if (state.onboard) {
        state.onboard.config({ networkId: Number(chainId) });
      }
    })
    .addCase(setActiveModal, (state, { payload }) => {
      state.activeModal = payload;
    }),
);
