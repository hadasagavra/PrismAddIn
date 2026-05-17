import apiClient from '../../../services/apiClient';
import { LoginRequest, AuthResponse } from '../../../types';

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/login/login', data);
  return response.data;
};