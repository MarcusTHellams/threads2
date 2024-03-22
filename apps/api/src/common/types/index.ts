import type DataLoader from 'dataloader';
import { type UserSelect, type PostSelect } from 'database';
import { Post } from 'src/graphql';

export type Context = {
  userFollowLoader: DataLoader<string, UserSelect[], string>;
  userFolloweeLoader: DataLoader<string, UserSelect[], string>;
  usePostsLoader: DataLoader<string, PostSelect[], string>;
  usePostedByLoader: DataLoader<string, UserSelect, string>;
};
