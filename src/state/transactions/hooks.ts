import { useSelector, useDispatch } from 'react-redux';

import { useWeb3 } from 'state/application/hooks';
import { getTxLink } from 'utils/getTxLink';
import { AppState, AppDispatch } from 'state';
import { GasNowData, Transaction } from './reducer';
import {
  addTxHistory as _addTxHistory,
  setTxHistory as _setTxHistory,
  clearTxHistory as _clearTxHistory,
  setTxStateMsg as _setTxStateMsg,
  setGasType as _setGasType,
  setGasPrices as _setGasPrices,
} from './actions';

export const useTxHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const txHistory = useSelector<
    AppState,
    AppState['transactions']['txHistory']
  >((state) => state.transactions.txHistory);

  const addTxHistory = (tx: Transaction) => dispatch(_addTxHistory(tx));

  const setTxHistory = (txHistory: Transaction[]) =>
    dispatch(_setTxHistory(txHistory));

  const clearTxHistory = () => dispatch(_clearTxHistory(undefined));

  return { txHistory, addTxHistory, setTxHistory, clearTxHistory };
};

export const useTxStateMsg = () => {
  const dispatch = useDispatch<AppDispatch>();
  const txStateMsg = useSelector<
    AppState,
    AppState['transactions']['txStateMsg']
  >((state) => state.transactions.txStateMsg);

  const setTxStateMsg = (msg: string | undefined | null) =>
    dispatch(_setTxStateMsg(msg));

  return { txStateMsg, setTxStateMsg };
};

export const useGasType = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gasType = useSelector<AppState, AppState['transactions']['gasType']>(
    (state) => state.transactions.gasType,
  );

  const setGasType = (gasType: keyof GasNowData) =>
    dispatch(_setGasType(gasType));

  return { gasType, setGasType };
};

export const useGasPrice = () => {
  const gasValue = useSelector<AppState, AppState['transactions']['gasValue']>(
    (state) => state.transactions.gasValue,
  );
  return gasValue;
};

export const useGasPrices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gasPrices = useSelector<
    AppState,
    AppState['transactions']['gasPrices']
  >((state) => state.transactions.gasPrices);

  const setGasPrices = (gasPrices: GasNowData) =>
    dispatch(_setGasPrices(gasPrices));

  return { gasPrices, setGasPrices };
};

export const useTxLink = (txHash: string | undefined | null) => {
  const { chainId } = useWeb3();

  if (!txHash || !chainId) {
    return null;
  }

  return getTxLink(txHash, chainId);
};
