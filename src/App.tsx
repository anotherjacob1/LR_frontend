import React, { Suspense, useEffect } from 'react';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Provider as StateProvider } from 'react-redux';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Lottie from 'react-lottie';

import ApplicationUpdater from './state/application/updater';
import MulticallUpdater from './state/multicall/updater';
import UserUpdater from './state/user/updater';
import TransactionsUpdater from './state/transactions/updater';
import { useIsDarkMode } from 'state/user/hooks';
import { darkTheme, lightTheme } from './theme';
import store from './state';

import blobLoader from './assets/animation/blob_loader.json';
import { StyledSnackbarProvider } from 'components';
import { Landing } from 'pages';

const useStyles = makeStyles(() => ({
  noti: {
    '& .MuiCollapse-wrapperInner': {
      marginBottom: '8px',
    },
  },
}));

const graphUrls: { [chainId: number]: string } = {
  1: 'https://api.thegraph.com/subgraphs/name/looks-rare/marketplace',
  4: 'https://api.thegraph.com/subgraphs/name/looks-rare/rinkeby-marketplace',
  42: 'https://api.thegraph.com/subgraphs/name/looks-rare/kovan-marketplace',
};

const StateUpdaters: React.FC = () => {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
      <UserUpdater />
      <TransactionsUpdater />
    </>
  );
};

const ThemeProvider: React.FC = ({ children }) => {
  const location = useLocation();
  const darkMode = useIsDarkMode();
  let theme = darkMode ? darkTheme : lightTheme;

  if (location.pathname.replace('/', '') === '') {
    theme = darkTheme;
  }

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

const Providers: React.FC = ({ children }) => {
  const chainId = Number(localStorage.getItem('chainId')) || 1;

  const client = new ApolloClient({
    uri: graphUrls[chainId],
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <StateProvider store={store}>
            <StateUpdaters />

            <ThemeProvider>
              <StyledSnackbarProvider>
                <CssBaseline />
                {children}
              </StyledSnackbarProvider>
            </ThemeProvider>
          </StateProvider>
        </Suspense>
      </BrowserRouter>
    </ApolloProvider>
  );
};

const App: React.FC = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasSetTimeout, setHasSetTimeout] = React.useState(false);
  const [isWindowLoading, setIsWindowLoading] = React.useState(true);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: blobLoader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleLoading = () => setIsWindowLoading(false);

  useEffect(() => {
    window.addEventListener('load', handleLoading);
    return () => window.removeEventListener('load', handleLoading);
  }, []);

  useEffect(() => {
    if (isLoading && !hasSetTimeout) {
      setHasSetTimeout(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isLoading, hasSetTimeout]);

  return (
    <div className={classes.noti}>
      <Providers>
        {(isLoading || isWindowLoading) && (
          <Box
            width='100vw'
            height='100vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
            position='fixed'
            top={0}
            left={0}
            zIndex={10000}
            style={{ backgroundColor: 'black' }}
          >
            <Lottie
              options={defaultOptions}
              height={120}
              width={120}
              isStopped={false}
              isPaused={false}
            />
          </Box>
        )}

        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>

          <Route path='*'>
            <Landing />
          </Route>
        </Switch>
      </Providers>
    </div>
  );
};

export default App;
