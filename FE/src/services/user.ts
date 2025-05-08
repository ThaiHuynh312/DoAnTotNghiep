import instance from "../utils/request";
import { IContact, IUser, IUserUpdate } from "../types/user";

export const apiGetUsers = async (): Promise<IUser[]> => {
  const res = await instance.get("/users");
  return res.data;
};

export const apiGetContactsHistory = async (): Promise<IContact[]> => {
  const res = await instance.get("/users/contacts");
  return res.data;
};

export const apiGetMe = async (): Promise<IUser> => {
  const res = await instance.get("/users/me");
  return res.data;
};

export const apiGetInfoUser = async (id: string): Promise<IUser> => {
  const res = await instance.get(`/users/${id}`);
  return res.data;
};

export const apiUpdateUser = async (data: FormData): Promise<IUserUpdate> => {
  const res = await instance.put("/users/me", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};