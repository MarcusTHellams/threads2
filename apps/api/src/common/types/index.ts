import type DataLoader from 'dataloader';
import { type UserSelect, type PostSelect, LikeSelect } from 'database';
import { Request, Response } from 'express';
import { ReplySelect } from 'database';

export type Context = {
  userFollowLoader: DataLoader<string, UserSelect[], string>;
  userFolloweeLoader: DataLoader<string, UserSelect[], string>;
  usePostsLoader: DataLoader<string, PostSelect[], string>;
  usePostedByLoader: DataLoader<string, UserSelect, string>;
  useLikeLoaderForPost: DataLoader<string, LikeSelect[], string>;
  useLikesForUserLoader: DataLoader<string, LikeSelect[], string>;
  useReplyLoaderForPost: DataLoader<string, ReplySelect[], string>;
  repliesPostedByViaPostId: DataLoader<string, UserSelect[], string>;
  repliesPostViaPostId: DataLoader<string, PostSelect[], string>;
  likesPostViaPostId: DataLoader<string, PostSelect[], string>;
  likesUserViaPostId: DataLoader<string, UserSelect[], string>;
  req: Request;
  res: Response;
};
