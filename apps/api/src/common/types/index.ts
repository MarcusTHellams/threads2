import type DataLoader from 'dataloader';
import { type UserSelect } from 'database';

export type Context = {
  userFollowLoader: DataLoader<string, UserSelect[], string>;
  userFolloweeLoader: DataLoader<string, UserSelect[], string>;
};
