import { createSelector, createSlice } from '@reduxjs/toolkit';
import { USER_STORAGE_KEY } from 'constant';
import { api, storageGet, storageRemove, storageSet } from 'utils';

import { AppThunk, RootState, AppDispatch } from './index';

interface IUser {
  token: string;
  username: string;
  name: string;
}

export interface IAuthForm {
  username: string;
  password: string;
}

export interface IAuthState {
  loading: boolean;
  errorMessage: string | null;
  user: IUser | null;
}

const initialState: IAuthState = {
  loading: false,
  errorMessage: null,
  user: storageGet(USER_STORAGE_KEY) || null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authReset: state => {
      state = {
        ...initialState
      }
    },
    authRequest: state => {
      state = {
        ...state,
        loading : true
      }
    },
    loginSuccess: (state, action ) => {
      state = {
        ...state,
        user : action.payload,
        loading: false,
      }
    },
    authError: (state, action ) => {
      state = {
        ...state,
        loading: false,
        errorMessage: action.payload
      } 
    },
    logoutSuccess: state => {
      state = {
        ...state,
        user: null,
        loading: false,
      } 
    },
  },
});

export const { authRequest, loginSuccess, authError, logoutSuccess } = authSlice.actions;

export const login = (user : IAuthForm) : AppThunk => async (dispatch: AppDispatch)  => {
  try {
    dispatch(authRequest());
    const {data} = await api.post('/login', user);
    storageSet(USER_STORAGE_KEY, data);
    dispatch(loginSuccess(data));
    window.location.replace('/');
  } catch (e) {
    dispatch(authError(e.message));
  }
}


export const logout = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(authRequest());
    // due to missing api
    // const {data} = await api.post('/api/auth/logout');
    storageRemove(USER_STORAGE_KEY);
    dispatch(logoutSuccess());
    window.location.replace('/login');
  } catch (e) {
    dispatch(authError(e.message));
  }
}
// Selectors __ TODO

const selector = (state: RootState) => state.auth

export const getLoading = createSelector(selector, ({loading}: IAuthState) => loading);
export const getUser = createSelector(selector, ({user}: IAuthState) => user);
export const getError = createSelector(selector, ({errorMessage}: IAuthState) => errorMessage);

export default authSlice.reducer;
