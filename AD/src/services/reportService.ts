import request from '../utils/request';
import { Report } from "../types/report"; // nếu có tách riêng types

export const getReports = async (): Promise<Report[]> => {
  const res = await request.get("/admin/reports");
  return res.data; 
};

export const updateReportStatus = async (reportId: string, status: "resolved" | "dismissed") => {
  const res = await request.patch(`/admin/reports/${reportId}/status`, { status });
  return res.data;
};
