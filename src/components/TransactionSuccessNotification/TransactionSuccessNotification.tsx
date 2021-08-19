import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { getTxLink } from 'utils/getTxLink';
import { ChainId } from '@sushiswap/sdk';

import { ReactComponent as LinkArrow } from 'assets/svg/LinkArrow.svg';
import { ReactComponent as Success } from 'assets/svg/NotificationSuccessIcon.svg';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    backgroundColor: palette.background.paper,
    border: `1px solid ${palette.divider}`,
    padding: '6px 6px 6px 15px',
    borderRadius: '12px',
    width: '250px',
    display: 'flex',
    alignItems: 'center',
  },
  textColumn: {
    display: 'flex',
    marginLeft: '10px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statusText: {
    color: palette.text.primary,
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '16px',
  },
  anchor: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.text.secondary,
    textDecoration: 'none',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
  hyperlink: {
    color: palette.text.secondary,
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '14px',
  },
}));

export interface TransactionsNotificationProps {
  description: string;
  hash?: string;
  chainId?: ChainId | 56 | 137;
}

const TransactionSuccessNotification: React.FC<TransactionsNotificationProps> =
  ({ description, hash, chainId }) => {
    const classes = useStyles();
    const { palette } = useTheme();
    const txLink = hash && chainId ? getTxLink(hash, chainId) : false;

    return (
      <Box className={classes.root}>
        <Success />
        <Box className={classes.textColumn}>
          <Typography className={classes.statusText}>
            Transaction successful
          </Typography>
          <Typography className={classes.hyperlink}>{description}</Typography>
          {hash && txLink && (
            <a
              href={txLink}
              target='_blank'
              rel='noreferrer'
              className={classes.anchor}
            >
              <Typography color='secondary' className={classes.hyperlink}>
                View on Etherscan
              </Typography>
              <Box
                display='flex'
                marginLeft='4px'
                height='14px'
                alignItems='center'
              >
                <LinkArrow fill={palette.text.secondary} />
              </Box>
            </a>
          )}
        </Box>
      </Box>
    );
  };

export default TransactionSuccessNotification;
