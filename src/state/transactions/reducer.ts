import { createReducer } from '@reduxjs/toolkit';

import {
  addTxHistory,
  setTxHistory,
  clearTxHistory,
  setTxStateMsg,
  setGasType,
  setGasPrices,
} from './actions';

export const GAS_MODE_LOCALSTORAGE_KEY = 'transactions/gas_mode';

export interface Transaction {
  hash: string;
  timestamp?: number;
  complete?: boolean;
  status?: string;
  description?: string;
}

export interface GasNowData {
  fast: Number;
  rapid: Number;
  slow: Number;
  standard: Number;
  timestamp: Number;
}

export interface PBCState {
  currentTxs?: Transaction[] | [];
  txHistory: Transaction[];
  txStateMsg?: string | null;
  gasValue: number;
  gasType?: keyof GasNowData;
  gasPrices?: GasNowData;
}

export const initialState: PBCState = {
  currentTxs: [],
  txStateMsg: '',
  txHistory: [],
  gasValue: 1,
  gasType: (localStorage.getItem(GAS_MODE_LOCALSTORAGE_KEY) ||
    'fast') as keyof GasNowData,
  gasPrices: undefined,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setTxStateMsg, (state, { payload }) => {
      state.txStateMsg = payload;
    })
    .addCase(setGasType, (state, { payload }) => {
      state.gasType = payload;
      state.gasValue = Number(state.gasPrices?.[payload] ?? state.gasValue);
      localStorage.setItem(GAS_MODE_LOCALSTORAGE_KEY, payload);
    })
    .addCase(setGasPrices, (state, { payload }) => {
      state.gasPrices = payload;
      state.gasValue = Number(
        payload[state.gasType as keyof GasNowData] ?? state.gasValue,
      );
    })
    .addCase(addTxHistory, (state, { payload }: { payload: Transaction }) => {
      if (
        state.txHistory.filter((val) => val.hash === payload.hash).length === 0
      ) {
        state.txHistory = [payload, ...(state.txHistory || [])];
        localStorage.setItem('txHistory', JSON.stringify(state.txHistory));
      }
    })
    .addCase(setTxHistory, (state, { payload }: { payload: Transaction[] }) => {
      state.txHistory = payload;
      localStorage.setItem('txHistory', JSON.stringify(state.txHistory));
    })
    .addCase(clearTxHistory, (state) => {
      state.txHistory = [];
      localStorage.setItem('txHistory', JSON.stringify([]));
    }),
);
