export interface Report {
  _id: string;
  reporter: Reporter;
  type: string;
  targetUser: null;
  targetPost: TargetPost;
  reason: string;
  images: string[];
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TargetPost {
  _id: string;
  creator: string;
  content: string;
  images: any[];
  likes: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Reporter {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}


