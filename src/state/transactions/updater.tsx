import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from 'state';
import { setGasPrices, setTxHistory } from './actions';
import { GasNowData } from './reducer';
import { ChainId } from '@sushiswap/sdk';

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>();

  let ws: any,
    websocket: any,
    timer: any,
    reConnectTimes = 0;

  function convertGasNowValueToNumber(gasNowValue: number): number {
    return Math.floor((gasNowValue || 1) / Math.pow(10, 9));
  }

  const { account, chainId } = useSelector<AppState, AppState['application']>(
    (state) => state.application,
  );

  const fetchGasData = () => {
    clearTimeout(timer);

    if (chainId === ChainId.MATIC)
      fetch('https://gasstation-mainnet.matic.network', { method: 'GET' })
        .then((res) => res.json())
        .then((json) => {
          const gasNowData: GasNowData = {
            slow: json.safeLow,
            standard: json.safeLow,
            fast: json.standard,
            rapid: json.fast,
            timestamp: json.blockTime,
          };

          dispatch(setGasPrices(gasNowData));
        });

    if (chainId === ChainId.BSC)
      fetch('https://bscgas.info/gas', { method: 'GET' })
        .then((res) => res.json())
        .then((json) => {
          const gasNowData: GasNowData = {
            slow: json.low,
            standard: json.standard,
            fast: json.fast,
            rapid: json.instant,
            timestamp: new Date(json.timestamp).getTime(),
          };

          dispatch(setGasPrices(gasNowData));
        });

    if (chainId === ChainId.RINKEBY || ChainId.FANTOM) {
      const gasNowData: GasNowData = {
        slow: 1,
        standard: 1,
        fast: 1.1,
        rapid: 1.2,
        timestamp: new Date().getTime(),
      };

      dispatch(setGasPrices(gasNowData));
    }

    if (chainId === ChainId.MAINNET)
      fetch(
        'https://www.gasnow.org/api/v3/gas/price?utm_source=GasNowExtension',
        {
          method: 'GET',
        },
      )
        .then((res) => res.json())
        .then((json) => {
          const gasNowData: GasNowData = {
            slow: convertGasNowValueToNumber(json.data.slow),
            standard: convertGasNowValueToNumber(json.data.standard),
            fast: convertGasNowValueToNumber(json.data.fast),
            rapid: convertGasNowValueToNumber(json.data.rapid),
            timestamp: json.data.timestamp,
          };

          dispatch(setGasPrices(gasNowData));

          reConnectTimes = 0;

          timer = setTimeout(() => {
            getGas(true);
          }, 15000);
        })
        .catch(() => {
          if (reConnectTimes < 20) {
            reConnectTimes++;
          }

          timer = setTimeout(getGas, reConnectTimes < 20 ? 1000 : 15000);
        });
  };

  const createWebSocketConnection = () => {
    if (ws) {
      return;
    }

    if ('WebSocket' in window) {
      websocket = false;

      ws = new WebSocket('wss://www.gasnow.org/ws/gasprice');

      ws.onmessage = function (event: any) {
        const dataStr = event.data;
        const json = JSON.parse(dataStr);
        const gasNowData: GasNowData = {
          slow: convertGasNowValueToNumber(json.data.slow),
          standard: convertGasNowValueToNumber(json.data.standard),
          fast: convertGasNowValueToNumber(json.data.fast),
          rapid: convertGasNowValueToNumber(json.data.rapid),
          timestamp: json.data.timestamp,
        };

        dispatch(setGasPrices(gasNowData));
      };

      ws.onclose = function () {
        ws = undefined;
        getGas(websocket);
      };
    } else {
      getGas(false);
    }
  };

  const getGas = (type: any) => {
    type ? createWebSocketConnection() : fetchGasData();
  };

  useEffect(() => {
    getGas(false);

    return () => {
      if (!ws) return;
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function fetchTransactions() {
      try {
        if (!!account) {
          const storedHistory = localStorage.getItem('txHistory');
          const transactions = storedHistory ? JSON.parse(storedHistory) : [];
          dispatch(setTxHistory(transactions));
        }
      } catch (err) {}
    }

    fetchTransactions();
  }, [account, dispatch]);

  useEffect(() => {
    fetchGasData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return null;
}
