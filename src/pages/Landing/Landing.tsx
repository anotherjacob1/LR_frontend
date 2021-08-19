import React from 'react';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useDisconnect, useWeb3 } from 'state/application/hooks';
import { useDarkModeManager } from 'state/user/hooks';

const useStyles = makeStyles(({ palette }) => ({
  box: {
    color: palette.background.paper,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Landing: React.FC = () => {
  const [darkMode] = useDarkModeManager();
  const { web3, onboard } = useWeb3();
  const disconnect = useDisconnect();
  const classes = useStyles({ darkMode });

  return (
    <Box className={classes.box}>
      {!web3 ? (
        <Button color='primary' onClick={() => onboard?.walletSelect()}>
          Connect Wallet
        </Button>
      ) : (
        <Button color='secondary' onClick={disconnect}>
          Disconnect
        </Button>
      )}
    </Box>
  );
};

export default Landing;
