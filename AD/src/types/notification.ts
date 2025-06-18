import { IPost } from "./post";

export interface INotificationResponse {
  notifications: INotification[];
}

export interface INotification {
  _id: string;
  user: string;
  fromUser: FromUser;
  post: IPost;
  type: string;
  isRead: boolean;
  createdAt: string;
  __v: number;
}

interface FromUser {
  _id: string;
  username: string;
  avatar: string;
}