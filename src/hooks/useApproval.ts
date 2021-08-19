import { useState, useEffect, useCallback } from 'react';
import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'ethers';

import { useTransact } from 'hooks';
import { useWeb3 } from 'state/application/hooks';
import { useGasPrice } from 'state/transactions/hooks';
import { useTokenContract } from './useContract';

export function useApproval(fromAddress?: string, toAddress?: string) {
  const { signer, account } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [allowance, setAllowance] = useState(0);
  const tokenContract = useTokenContract(fromAddress);
  const transact = useTransact();
  const gasPrice = useGasPrice();

  const fetchAllowance = useCallback(async () => {
    if (!tokenContract || !toAddress) return;

    try {
      const decimals = await tokenContract.connect(signer!).decimals();
      const allowance = await tokenContract?.allowance(account, toAddress);

      setAllowance(Number(allowance) / 10 ** decimals);
      setLoading(false);
    } catch (e) {
      return console.error(e);
    }
  }, [tokenContract, account, signer, toAddress]);

  useEffect(() => {
    if (account && toAddress && tokenContract) {
      fetchAllowance().catch((e) => console.error(e));
    }

    const refreshInterval = setInterval(fetchAllowance, 1000);

    return () => clearInterval(refreshInterval);
  }, [account, tokenContract, toAddress, fetchAllowance]);

  const handleApprove = useCallback(
    async (approval: boolean = true) => {
      if (!tokenContract || !toAddress || !signer) return;
      try {
        const symbol = await tokenContract.connect(signer!).symbol();

        return transact(
          tokenContract
            .connect(signer!)
            .approve(toAddress, approval ? ethers.constants.MaxUint256 : 0, {
              gasPrice: parseUnits(String(gasPrice), 'gwei'),
            }),
          `${approval ? 'Approve' : 'Disapprove'} ${symbol} transfer`,
        );
      } catch (e) {
        return console.error(e);
      }
    },
    [signer, transact, gasPrice, toAddress, tokenContract],
  );

  return { loading, allowance, onApprove: handleApprove };
}

export default useApproval;
