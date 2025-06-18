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
  gender?: "male" | "female" | "other" | "";
  birthday?: string;
  role?: "student" | "tutor";
  address: IAddress;
  backgroundImage?: string;
  grades?: string[];
  subjects?: string[];
  searchable?: boolean;
  education?: string;
  experience?: string;
  pricePerHour?: number;
}

export interface IAddress {
  name: string;
  lng: number;
  lat: number;
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
  address: IAddress;
  birthday?: string;
  role?: "student" | "tutor";
  backgroundImage?: string;
  grades?: string[];
  subjects?: string[];
  education?: string;
  experience?: string;
  pricePerHour?: number;
}

export interface ISearchFiltersResponse {
  users: IUser[];
}

export interface SearchFilters {
  username?: string;
  address?: string;
  grade?: string;
  subject?: string;
  gender?: string;
}
