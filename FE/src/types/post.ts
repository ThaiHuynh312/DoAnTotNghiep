export interface IPosts {
  message: string;
  posts: IPost[];
}

export interface ICreatPost {
  message: string;
  post: IPost;
}

export interface IDeletePost {
  message: string;
}

export interface IPost {
  _id: string;
  creator: Creator;
  content: string;
  images: string[];
  likes: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Creator {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface ILikePost {
  message: string;
  likesCount: number;
  likedUsers: string[];
}