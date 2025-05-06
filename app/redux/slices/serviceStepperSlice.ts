import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export type Service = {
  id:            number;
  name:          string;
  description:   string;
  urlImage:      null;
  type:          number;
  price:         number;
  specialPrice:  null;
  location:      null;
  latitude:      null;
  longitude:     null;
  userId:        number;
  averageRating: null;
  deletedAt:     null;
  createdAt:     Date;
  updatedAt:     Date;
}

interface StepperState { 
  service?: Service;
    currentStep: number;
  }

  const initialState: StepperState = {
    service: undefined,
    currentStep: 0,
  };

  const serviceStepperSlice = createSlice({
    name: 'serviceStepper',
    initialState,
    reducers: {
      setCurrentStep      (state, action: PayloadAction<number>) {
        state.currentStep = action.payload;
      },
      setServiceState      (state, action: PayloadAction<Service>) {
        state.service = action.payload;
      },
      clearStepper(state) {
        state.currentStep = initialState.currentStep;
        state.service = initialState.service;
      }
    },
  });
  
  export const { setCurrentStep, setServiceState, clearStepper } = serviceStepperSlice.actions;
  export const selectStepper = (state: RootState) => state.serviceStepper;

  export default serviceStepperSlice.reducer;

