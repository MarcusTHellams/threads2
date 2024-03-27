import { create } from 'zustand';
import { PostSelect } from 'database';

type PostStoreState = {
  posts: PostSelect[];
};

type PostStoreActions = {
  setPosts: (posts: PostSelect[]) => void;
};
export const usePostStore = create<PostStoreState & PostStoreActions>(
  (set) => ({
    posts: [],
    setPosts: (posts: PostSelect[]) => set(() => ({ posts })),
  }),
);
