import { createAction } from '@reduxjs/toolkit';

import { GasNowData, Transaction } from './reducer';

export const addTxHistory = createAction<Transaction>(
  'transactions/addTxHistory',
);

export const setTxHistory = createAction<Transaction[]>(
  'transactions/setTxHistory',
);

export const clearTxHistory = createAction<any | null | undefined>(
  'transactions/clearTxHistory',
);

export const setTxStateMsg = createAction<string | null | undefined>(
  'transactions/setTxStateMsg',
);

export const setGasType = createAction<keyof GasNowData>(
  'transactions/setGasType',
);

export const setGasPrices = createAction<any>('transactions/setGasPrices');
