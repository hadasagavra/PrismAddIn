import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import managerReducer from '../features/manager/redux/managerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    manager: managerReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;