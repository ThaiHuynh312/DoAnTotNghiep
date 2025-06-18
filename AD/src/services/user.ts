// src/services/userService.ts
import request from '../utils/request';
import { IUser } from '../types/user';

export const getUsers = async (): Promise<IUser[]> => {
  const res = await request.get('/admin/users');
  return res.data;
};

export const updateUserStatus = async (userId: string, status: 'active' | 'blocked') => {
  const res = await request.patch(`/admin/users/${userId}/status`, { status });
  return res.data;
};