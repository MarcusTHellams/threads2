import type DataLoader from 'dataloader';
import { type UserSelect, type PostSelect, LikeSelect } from 'database';
import { Request, Response } from 'express';

export type Context = {
  userFollowLoader: DataLoader<string, UserSelect[], string>;
  userFolloweeLoader: DataLoader<string, UserSelect[], string>;
  usePostsLoader: DataLoader<string, PostSelect[], string>;
  usePostedByLoader: DataLoader<string, UserSelect, string>;
  useLikeLoaderForPost: DataLoader<string, LikeSelect[], string>;
  useLikesForUserLoader: DataLoader<string, LikeSelect[], string>;
  req: Request;
  res: Response;
};
