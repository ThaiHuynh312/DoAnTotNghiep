import { INotificationResponse } from "@/types/notification";
import instance from "@/utils/request";

export const apiGetAllNotification = async (): Promise<INotificationResponse> => {
  const res = await instance.get("/notifications");
  return res.data;
};

export const apiMarkNotificationAsRead = async (id: string): Promise<void> => {
  await instance.patch(`/notifications/${id}/read`);
};