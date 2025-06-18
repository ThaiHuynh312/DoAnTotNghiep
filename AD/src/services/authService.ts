import { ILoginInput, IRegisterInput, ILoginResponse, IRegisterResponse } from '../types/auth';
import instance from '../utils/request';

export const apiLogin = async (input: ILoginInput): Promise<ILoginResponse> => {
  const res = await instance.post(`/admin/login`, input);
  return res.data;
};

export const apiRegister = async (input: IRegisterInput): Promise<IRegisterResponse> => {
  const res = await instance.post(`/auth/register`, input);
  return res.data;
};

export const apiRefreshToken = async (data: { refresh_token: string }): Promise<IRegisterResponse> => {
  const response = await instance.post<IRegisterResponse>('/auth/refresh-token', data)
  return response.data
}
