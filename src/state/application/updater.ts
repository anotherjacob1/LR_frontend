import Onboard from 'bnc-onboard';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ChainId } from '@sushiswap/sdk';
import { Wallet } from 'bnc-onboard/dist/src/interfaces';
import { ethers } from 'ethers';

import { wallets } from '../../constants';
import { useDebounce, useIsWindowVisible } from 'hooks';
import { useIsDarkMode } from 'state/user/hooks';
import { getSignerAndContracts } from 'web3/contracts';
import { AppState } from 'state';
import { updateBlockNumber, setWeb3Settings } from './actions';

export default function Updater(): null {
  const dispatch = useDispatch();
  const location = useLocation();
  const windowVisible = useIsWindowVisible();
  const dark = useIsDarkMode();

  const {
    onboard: _onboard,
    chainId,
    web3,
    signer,
    contracts,
    blockNumber,
  } = useSelector<AppState, AppState['application']>(
    (state) => state.application,
  );

  const [state, setState] = useState<{
    blockNumber: number | null;
    hasRequestedAccounts: boolean;
  }>({
    blockNumber: null,
    hasRequestedAccounts: false,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((s) => ({ ...s, blockNumber }));
    },
    [setState],
  );

  useEffect(() => {
    if (!web3 || !chainId || !windowVisible) return undefined;

    setState((s) => ({ ...s, blockNumber: null }));

    if (!blockNumber) {
      web3
        .getBlockNumber()
        .then(blockNumberCallback)
        .catch((error: any) =>
          console.error(
            `Failed to get block number for chainId: ${chainId}`,
            error,
          ),
        );
    }

    web3.on('block', blockNumberCallback);

    return () => {
      web3.removeListener('block', blockNumberCallback);
    };
  }, [
    dispatch,
    chainId,
    web3,
    blockNumber,
    blockNumberCallback,
    windowVisible,
  ]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (!debouncedState.blockNumber || !windowVisible) return;

    dispatch(updateBlockNumber(debouncedState.blockNumber));
  }, [windowVisible, dispatch, debouncedState.blockNumber]);

  useEffect(() => {
    if (!web3 || state.hasRequestedAccounts) return;

    setState((s) => ({ ...s, hasRequestedAccounts: true }));

    const ethereum = (window as any).ethereum;

    const handleGetAccountAndContracts = async (
      web3: ethers.providers.Web3Provider,
    ) => {
      const {
        contracts,
        signer,
        chainId: _chainId,
      } = await getSignerAndContracts(web3);

      dispatch(setWeb3Settings({ contracts, signer, chainId: _chainId }));
    };

    ethereum?.request({ method: 'eth_requestAccounts' }).then(() => {
      handleGetAccountAndContracts(web3).catch((e) => console.error(e));

      dispatch(setWeb3Settings({ ethereum }));
    });

    ethereum?.on('accountsChanged', async () => {
      handleGetAccountAndContracts(web3).catch((e) => console.error(e));
    });

    ethereum?.on('chainChanged', () => {
      document.location.reload();
    });
  }, [
    web3,
    chainId,
    location,
    signer,
    contracts,
    state.hasRequestedAccounts,
    dispatch,
  ]);

  useEffect(() => {
    if (_onboard) return;

    const chain = Number(localStorage.getItem('chainId') || 1);

    const onboard = Onboard({
      subscriptions: {
        address: (account: string) => {
          dispatch(setWeb3Settings({ account }));
        },
        network: (chainId: ChainId | undefined) => {
          dispatch(setWeb3Settings({ chainId }));

          if (chainId) {
            localStorage.setItem('chainId', String(chainId));
          }
        },
        balance: (balance: string) => dispatch(setWeb3Settings({ balance })),
        wallet: async (wallet: Wallet) => {
          const walletAvailable = await onboard.walletCheck();

          if (walletAvailable) {
            const web3 = new ethers.providers.Web3Provider(wallet.provider);

            if (window.localStorage) {
              window.localStorage.setItem('selectedWallet', wallet.name as any);
            }

            dispatch(setWeb3Settings({ wallet, web3 }));
          } else {
            dispatch(
              setWeb3Settings({
                wallet: null,
                web3: null,
                account: '',
                balance: '',
              }),
            );
          }
        },
      },
      networkId: chainId || 1,
      dappId: process.env.REACT_APP_BLOCKNATIVE_KEY,
      hideBranding: true,
      darkMode: dark,
      walletSelect: { wallets: wallets(chain) },
      walletCheck: [
        { checkName: 'derivationPath' },
        { checkName: 'connect' },
        { checkName: 'accounts' },
      ],
    });

    console.log('onboard', onboard);

    dispatch(setWeb3Settings({ onboard }));
  }, [dispatch, _onboard, location, web3, chainId, signer, dark]);

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage
      ? window.localStorage.getItem('selectedWallet')
      : undefined;

    if (
      previouslySelectedWallet &&
      _onboard &&
      !['WalletLink', 'Coinbase'].includes(previouslySelectedWallet)
    ) {
      _onboard.walletSelect(previouslySelectedWallet);
    }
  }, [_onboard, dispatch, web3]);

  return null;
}
