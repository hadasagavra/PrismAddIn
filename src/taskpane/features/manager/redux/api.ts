import apiClient from '../../../services/apiClient';
import { 
  Category, Manager, Email, 
  CreateManagerRequest, UpdateManagerRequest, ClassifyEmailRequest 
} from '../../../types';

// Categories
export const getCategoriesApi = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};

export const addCategoryApi = async (category: Partial<Category>): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', category);
  return response.data;
};

export const updateCategoryApi = async (id: number, category: Partial<Category>): Promise<Category> => {
  const response = await apiClient.put<Category>(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategoryApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

// Managers
export const getManagersApi = async (): Promise<Manager[]> => {
  const response = await apiClient.get<Manager[]>('/managers');
  return response.data;
};

export const addManagerApi = async (data: CreateManagerRequest): Promise<Manager> => {
  const response = await apiClient.post<Manager>('/managers', data);
  return response.data;
};

export const updateManagerApi = async (id: number, data: UpdateManagerRequest): Promise<Manager> => {
  const response = await apiClient.put<Manager>(`/managers/${id}`, data);
  return response.data;
};

// Emails
export const getEmailsApi = async (): Promise<Email[]> => {
  const response = await apiClient.get<Email[]>('/emailrequests');
  return response.data;
};

export const classifyEmailApi = async (id: number, data: ClassifyEmailRequest): Promise<Email> => {
  const response = await apiClient.patch<Email>(`/emailrequests/${id}/classify`, data);
  return response.data;
};
export const getManagerByIdApi = async (id: number): Promise<Manager> => {
  const response = await apiClient.get<Manager>(`/managers/${id}`);
  return response.data;
};
export const changePasswordApi = async (
  id: number,
  data: { currentPassword: string; newPassword: string }
): Promise<void> => {
  await apiClient.patch(`/managers/${id}/change-password`, data);
};
export const addEmailApi = async (data: {
  subject: string;
  content: string;
  senderEmail: string;
}): Promise<Email> => {
  const response = await apiClient.post<Email>('/emailrequests', data);
  return response.data;
};

export const getEmailByIdApi = async (id: number): Promise<Email> => {
  const response = await apiClient.get<Email>(`/emailrequests/${id}`);
  return response.data;
};