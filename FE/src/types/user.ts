export interface IUserUpdate {
  message: string;
  updatedUser: IUser;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female" | "other" | "";
  birthday?: string;
  role?: "student" | "tutor";
}

export interface IContact {
  _id: string;
  avatar?: string;
  username: string;
  email: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  avatar?: string | File | null;
  gender?: "male" | "female" | "other" | "";
  bio?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  role?: "student" | "tutor";
}
