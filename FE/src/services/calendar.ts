import instance from "../utils/request";
import { ICalendarEvent, ICreateCalendarEventPayload } from "../types/calendar";

export const apiGetCalendarEvents = async (): Promise<ICalendarEvent[]> => {
  const res = await instance.get("/calendar/me");
  return res.data;
};

export const apiGetCalendarEventsByUserId = async (
  userId: string
): Promise<ICalendarEvent[]> => {
  const res = await instance.get(`/calendar/user/${userId}`);
  return res.data;
};

export const apiCreateCalendarEvent = async (
  data: ICreateCalendarEventPayload
): Promise<ICalendarEvent> => {
  const res = await instance.post("/calendar", data);
  return res.data;
};

export const apiUpdateCalendarEvent = async (
  id: string,
  data: ICreateCalendarEventPayload
): Promise<ICalendarEvent> => {
  const res = await instance.put(`/calendar/${id}`, data);
  return res.data;
};

export const apiDeleteCalendarEvent = async (id: string): Promise<void> => {
  await instance.delete(`/calendar/${id}`);
};
