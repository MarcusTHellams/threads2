import { create } from 'zustand';

type State = 'login' | 'signup';


type AuthStoreState = {
  auth: State;
}

type AuthStoreActions = {
  setAuth: (auth: State)=> void
}
export const useAuthStore = create<AuthStoreState & AuthStoreActions>((set) => ({
  auth: 'login',
	setAuth: (auth: State) => set(() => ({ auth })),
}));
