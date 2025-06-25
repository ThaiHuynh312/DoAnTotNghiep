import request from '../utils/request';
import { Report } from "../types/report";
import { IPost } from "../types/post";

export const getReports = async (): Promise<Report[]> => {
  const res = await request.get("/admin/reports");
  return res.data; 
};

export const updateReportStatus = async (reportId: string, status: "resolved" | "dismissed") => {
  const res = await request.patch(`/admin/reports/${reportId}/status`, { status });
  return res.data;
};

export const getReportedPosts = async (): Promise<IPost[]> => {
  const res = await request.get("/admin/reported-posts");
  return res.data.data;
};

export const updatePostStatus = async (postId: string, status: "active" | "banned") => {
  const res = await request.patch(`/admin/posts/${postId}/status`, { status });
  return res.data;
};