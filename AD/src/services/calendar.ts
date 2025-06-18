import instance from "../utils/request";
import { ICalendarEvent, ICreateCalendarEventPayload } from "../types/calendar";

// Lấy danh sách sự kiện
export const apiGetCalendarEvents = async (): Promise<ICalendarEvent[]> => {
  const res = await instance.get("/calendar");
  return res.data;
};

// Tạo mới sự kiện
export const apiCreateCalendarEvent = async (
  data: ICreateCalendarEventPayload
): Promise<ICalendarEvent> => {
  const res = await instance.post("/calendar", data);
  return res.data;
};

// Cập nhật sự kiện
export const apiUpdateCalendarEvent = async (
  id: string,
  data: ICreateCalendarEventPayload
): Promise<ICalendarEvent> => {
  const res = await instance.put(`/calendar/${id}`, data);
  return res.data;
};

// Xoá sự kiện
export const apiDeleteCalendarEvent = async (id: string): Promise<void> => {
  await instance.delete(`/calendar/${id}`);
};
