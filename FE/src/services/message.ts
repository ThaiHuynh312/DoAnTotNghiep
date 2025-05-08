import { IMessage } from "../types/message";
import instance from "../utils/request";

export const apiSendMessage = async (data: {
  receiver: string;
  content: string;
}): Promise<IMessage> => {
  const response = await instance.post<IMessage>("/messages", data);
  return response.data;
};

export const apiGetMessages = async (receiverId: string): Promise<IMessage[]> => {
  const response = await instance.get<IMessage[]>(`/messages/${receiverId}`);
  return response.data;
};
