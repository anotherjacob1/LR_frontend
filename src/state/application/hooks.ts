import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { API as NotifyAPI } from 'bnc-notify';

import { AppState, AppDispatch } from 'state';
import { ApplicationModal, setActiveModal, setWeb3Settings } from './actions';

export function useBlockNumber(): number | undefined {
  return useSelector((state: AppState) => state.application.blockNumber);
}

export function useNotify(): NotifyAPI {
  return useSelector((state: AppState) => state.application.notify);
}

export function useDisconnect() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector<AppState, AppState['application']>(
    (state) => state.application,
  );

  const disconnect = useCallback(() => {
    dispatch(
      setWeb3Settings({
        wallet: undefined,
        web3: undefined,
        account: '',
        balance: '',
      }),
    );

    state.onboard?.walletReset();
    localStorage.removeItem('selectedWallet');
  }, [dispatch, state]);

  return disconnect;
}

export function useWeb3() {
  const state = useSelector<AppState, AppState['application']>(
    (state) => state.application,
  );

  return state;
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const activeModal = useSelector(
    (state: AppState) => state.application.activeModal,
  );
  return activeModal === modal;
}

export function useToggleModal(modal: ApplicationModal) {
  const open = useModalOpen(modal);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (toState = !open) => dispatch(setActiveModal(toState ? modal : null)),
    [dispatch, modal, open],
  );
}

export function useOpenModal(modal: ApplicationModal) {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setActiveModal(modal)), [dispatch, modal]);
}

export function useCloseModals() {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setActiveModal(null)), [dispatch]);
}

export function useToggleTxLoadingModal() {
  return useToggleModal(ApplicationModal.TransactionLoading);
}

export function useToggleTxSuccessModal() {
  return useToggleModal(ApplicationModal.TransactionSuccess);
}

export function useToggleTxCancelledModal() {
  return useToggleModal(ApplicationModal.TransactionCancelled);
}

export function useToggleTxFailedModal() {
  return useToggleModal(ApplicationModal.TransactionFailed);
}
