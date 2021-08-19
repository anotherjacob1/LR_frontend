import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ContractTransaction } from 'ethers';
import { useSnackbar } from 'notistack';

import { useWeb3 } from 'state/application/hooks';
import { useTxHistory } from 'state/transactions/hooks';
import { Transaction } from 'state/transactions/reducer';
import { AppDispatch } from 'state';
import {
  TransactionLoadingNotification,
  TransactionCancelledNotification,
  TransactionSuccessNotification,
  TransactionFailedNotification,
} from 'components';

export interface TransactProps {
  description?: string;
}

export function useTransact() {
  const { notify, chainId } = useWeb3();
  const dispatch = useDispatch<AppDispatch>();
  const { addTxHistory } = useTxHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const transact = useCallback(
    async (
      contractFnPromise: Promise<ContractTransaction | undefined> | undefined,
      description: string = '',
    ) => {
      const preApprovalTx = enqueueSnackbar(undefined, {
        content: () =>
          TransactionLoadingNotification({
            description,
            close: () => closeSnackbar(preApprovalTx),
          }),
        persist: true,
      });

      try {
        const tx = await contractFnPromise;
        if (tx) {
          closeSnackbar(preApprovalTx);
          const pendingTx = enqueueSnackbar(undefined, {
            content: () =>
              TransactionLoadingNotification({
                description,
                hash: tx.hash,
                chainId,
                close: () => closeSnackbar(pendingTx),
              }),

            persist: true,
          });
          const { emitter } = notify.hash(tx.hash);

          emitter.on('txConfirmed', (transaction: any) => {
            closeSnackbar(pendingTx);
            enqueueSnackbar(undefined, {
              content: () =>
                TransactionSuccessNotification({
                  description,
                  hash: tx.hash,
                  chainId,
                }),
              autoHideDuration: 4500,
            });
            dispatch(
              addTxHistory({
                hash: transaction.hash,
                timestamp: transaction.timeStamp,
                complete: true,
              } as Transaction),
            );
          });

          emitter.on('txFailed', () => {
            closeSnackbar(pendingTx);
            enqueueSnackbar(undefined, {
              content: () =>
                TransactionFailedNotification({
                  description,
                  hash: tx.hash,
                  chainId,
                }),
              autoHideDuration: 4500,
            });
            addTxHistory({
              hash: tx.hash,
              timestamp: tx.timestamp,
              complete: false,
            } as Transaction);
          });

          emitter.on('txCancel', (err) => {
            closeSnackbar(pendingTx);
            enqueueSnackbar(undefined, {
              content: () =>
                TransactionCancelledNotification({
                  description,
                  hash: tx.hash,
                  chainId,
                }),
              autoHideDuration: 3000,
            });
            console.log('Error in transaction: ', err);
          });
        } else {
          closeSnackbar(preApprovalTx);
        }

        await tx?.wait(1);

        return tx;
      } catch (err) {
        console.log('Error in transaction: ', err);
        closeSnackbar(preApprovalTx);
        enqueueSnackbar(undefined, {
          content: () =>
            TransactionCancelledNotification({
              description,
            }),
          autoHideDuration: 3000,
        });
      }
    },
    [enqueueSnackbar, closeSnackbar, notify, chainId, dispatch, addTxHistory],
  );

  return transact;
}

export default useTransact;
