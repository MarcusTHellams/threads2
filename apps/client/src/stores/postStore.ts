import { create } from 'zustand';
import { PostResponse } from '../common/types';

type PostStoreState = {
  posts: PostResponse[];
};

type PostStoreActions = {
  setPosts: (posts: PostResponse[]) => void;
};
export const usePostStore = create<PostStoreState & PostStoreActions>(
  (set) => ({
    posts: [],
    setPosts: (posts: PostResponse[]) => set(() => ({ posts })),
  }),
);
