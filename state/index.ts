import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import transactions from './transactions/reducer';
import application from './application/reducer';
import multicall from './multicall/reducer';
import userInfo from './userInfo/reducer';

const PERSISTED_KEYS: string[] = ['application', 'transactions', 'userInfo'];

const store = configureStore({
  reducer: {
    transactions,
    application,
    multicall,
    userInfo
  },
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false
    }),
    save({
      states: PERSISTED_KEYS
    })
  ],
  preloadedState: (() => {
    if (typeof localStorage === 'undefined') return;
    return load({
      states: PERSISTED_KEYS
    });
  })()
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
