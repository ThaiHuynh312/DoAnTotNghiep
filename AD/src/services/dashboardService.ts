import request from '../utils/request';

export const getDashboardStats = async () => {
  const res = await request.get('/admin/dashboard/stats');
  return res.data.data;
};
