import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserSelect } from 'database';

export type User = Omit<UserSelect, 'password' | 'refreshToken'>;

type UserStoreState = {
  user: User | null;
}

type UserStoreActions = {
  setUser: (user: User)=> void
}
export const useUserStore = create(persist<UserStoreState & UserStoreActions>((set) => ({
  user: null,
	setUser: (user: User | null) => set(() => ({ user })),
}), {
  name: 'user',
  storage : createJSONStorage(()=> localStorage)
}));
