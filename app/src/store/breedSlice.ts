import { createSlice } from '@reduxjs/toolkit';
import { USER_STORAGE_KEY } from 'constant';
import { api, storageRemove, storageSet } from 'utils';

import { AppThunk } from './index'; 

export interface IDoggos {
  id: number,
  name: string
}
export interface ICharacteristic {
  characteristic: string
}

export interface IBreedDetail {
  id: number,
  details: {
    name: string,
    image_url: string,
    characteristics: ICharacteristic[]
  }
}

interface IBreedState {
  loading: boolean;
  errorMessage: string | null;
  breed: IDoggos[] | null;
  breedDetail: IBreedDetail | null;
}

const initialState: IBreedState = {
  loading: false,
  errorMessage: null,
  breed: null,
  breedDetail: null,
};

export const breedSlice = createSlice({
  name: 'breed',
  initialState,
  reducers: {
    breedReset: state => {
      state = {
        ...initialState
      }
    },
    breedRequest: state => {
      state = {
        ...state,
        loading : true
      }
    },
    breedSuccess: (state, action ) => {
      state = {
        ...state,
        breed : action.payload,
        loading: false,
      }
    },
    breedError: (state, action ) => {
      state = {
        ...state,
        loading: false,
        errorMessage: action.payload
      } 
    },
    breedDetailSuccess: (state, action ) => {
      state = {
        ...state,
        breedDetail: action.payload,
        loading: false,
      }
    },
  },
});

export const { breedReset, breedRequest, breedSuccess, breedError, breedDetailSuccess } = breedSlice.actions;

export const getBreeds = () : AppThunk => async dispatch => {
  try {
    dispatch(breedRequest());
    const {data} = await api.get('/breed-list');
    dispatch(breedSuccess(data));
  } catch (e) {
    dispatch(breedError(e.message));
  }
}


export const getBreedDetail = ({breedId}: {breedId: string}) : AppThunk => async dispatch => {
  try {
    dispatch(breedRequest());
    const {data} = await api.get(`/breed/${breedId}`);
    dispatch(breedDetailSuccess(data));
  } catch (e) {
    dispatch(breedError(e.message));
  }
}

// Selectors __ TODO

export default breedSlice.reducer;
