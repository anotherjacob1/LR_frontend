import React from 'react';
import { Typography, Box, CircularProgress } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { getTxLink } from 'utils/getTxLink';
import { ChainId } from '@sushiswap/sdk';

import { ReactComponent as LinkArrow } from 'assets/svg/LinkArrow.svg';
import { ReactComponent as XOut } from 'assets/svg/XOutGrey.svg';

const useStyles = makeStyles(({ palette }) => ({
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
    color: palette.text.secondary,
    textDecoration: 'none',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
  hyperlink: {
    color: palette.text.secondary,
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '15px',
  },
  dismissalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px 0px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: palette.primary.dark,
    },
  },
}));

export interface TransactionsNotificationProps {
  description: string;
  close?: () => void;
  hash?: string;
  chainId?: ChainId | 56 | 137;
}

const TransactionLoadingNotification: React.FC<TransactionsNotificationProps> =
  ({ description, hash, chainId, close }) => {
    const classes = useStyles();
    const { palette } = useTheme();
    const txLink = hash && chainId ? getTxLink(hash, chainId) : false;

    return (
      <Box>
        <Box
          style={{
            backgroundColor: palette.background.paper,
            border: `1px solid ${palette.divider}`,
            padding: '6px 6px 6px 15px',
            borderRadius: '12px',
            width: '278px',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'all',
            justifyContent: 'space-between',
          }}
        >
          <CircularProgress size={22} />
          <Box
            display='flex'
            marginLeft='10px'
            flexDirection='column'
            alignItems='flex-start'
            justifyContent='space-between'
          >
            <Typography
              style={{
                color: palette.text.primary,
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '16px',
              }}
            >
              Transaction pending
            </Typography>
            <Typography
              style={{
                color: palette.text.secondary,
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '15px',
              }}
            >
              {description}
            </Typography>
            {hash && txLink && (
              <a
                href={txLink}
                target='_blank'
                rel='noreferrer'
                className={classes.anchor}
              >
                <Typography className={classes.hyperlink}>
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
          <Box onClick={close} className={classes.dismissalContainer}>
            <XOut style={{ width: '10px', height: '30px' }} />
          </Box>
        </Box>
      </Box>
    );
  };

export default TransactionLoadingNotification;
