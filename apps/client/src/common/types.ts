import { UserSelect } from 'database';

export type AuthResponse = {
  accessToken: string;
  user: UserSelect;
};

export interface UserResponse {
  bio?: string;
  createdAt: string;
  email: string;
  isFrozen: boolean;
  name: string;
  profilePic?: string;
  updatedAt: string;
  userId: string;
  followers: UserResponse[];
  follows: UserResponse[];
}

export interface PostResponse {
  createdAt: string;
  image?: string;
  postId: string;
  text: string;
  updatedAt: string;
  userId: string;
  postedBy: UserResponse;
  replies: ReplyResponse[];
}
export interface ReplyResponse {
  createdAt: string;
  text: string;
  postId: string;
  updatedAt: string;
  userId: string;
  postedBy: UserResponse;
  post: PostResponse;
}
