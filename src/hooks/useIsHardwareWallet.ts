import { useWeb3 } from 'state/application/hooks';

export function useIsHardwareWallet(): boolean {
  const { onboard } = useWeb3();

  return onboard?.getState().wallet.type === 'hardware';
}

export default useIsHardwareWallet;
