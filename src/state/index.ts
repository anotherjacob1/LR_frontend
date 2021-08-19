import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import { updateVersion } from './user/actions';
import application from './application/reducer';
import user from './user/reducer';
import multicall from './multicall/reducer';
import transactions from './transactions/reducer';

const PERSISTED_KEYS: string[] = ['user'];
const NAMESPACE = 'LooksRare_v0.0.1';

const store = configureStore({
  reducer: {
    application,
    multicall,
    user,
    transactions,
  },
  middleware: [
    ...getDefaultMiddleware({
      thunk: false,
      immutableCheck: false,
      serializableCheck: false,
    }),
    save({ states: PERSISTED_KEYS, namespace: NAMESPACE }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS, namespace: NAMESPACE }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
