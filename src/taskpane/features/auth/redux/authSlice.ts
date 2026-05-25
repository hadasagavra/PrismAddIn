import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../../types';

interface AuthState {
  manager: {
    id: number;
    name: string;
    email: string;
    isSuperAdmin: boolean;
  } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {                          // ← שונה: : במקום satisfies
  manager: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};                                                          // ← בלי satisfies בסוף

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, { payload }: PayloadAction<AuthResponse>) {
      state.manager = {
        id: payload.managerId,
        name: payload.name,
        email: payload.email,
        isSuperAdmin: payload.isSuperAdmin,
      };
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    },
    logout(state) {
      state.manager = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;