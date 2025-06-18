import { ICreatPost, IDeletePost, ILikePost, IPosts } from "@/types/post";
import instance from "@/utils/request";

export const apiGetAllPost = async (): Promise<IPosts> => {
  const res = await instance.get("/posts");
  return res.data;
};

export const apiGetUserPosts = async ( id: string ): Promise<IPosts> => {
  const res = await instance.get(`/posts/user/${id}`);
  return res.data;
};

export const apiCreatePost = async (data: FormData): Promise<ICreatPost> => {
  const res = await instance.post("/posts", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const apiDeletePost = async (id: string): Promise<IDeletePost> => {
  const res = await instance.delete(`/posts/${id}`);
  return res.data;
};

export const apiUpdatePost = async (
  id: string,
  data: FormData
): Promise<ICreatPost> => {
  const res = await instance.put(`/posts/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const apiLikePost = async (id: string): Promise<ILikePost> => {
  const res = await instance.post(`/posts/${id}/like`);
  return res.data;
};