import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';

import counterReducer from './counterSlice';
import authReducer from './authSlice';
import breedReducer from './breedSlice';

const reducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  breed: breedReducer,
});

export const store = configureStore({
  reducer: reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
