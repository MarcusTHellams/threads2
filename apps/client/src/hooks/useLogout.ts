import { useShowToast } from './useShowToast';
import { User, useUserStore } from '../stores/userStore';
import { useMutation } from '@tanstack/react-query';
import { api } from '../common/api';

export const useLogout = () => {
  const setUser = useUserStore((state) => state.setUser);
  const showToast = useShowToast();

  const { mutate: logout } = useMutation({
    mutationKey: ['logout'],
    async mutationFn() {
      return api.get<string>('/auth/logout').then((resp) => resp.data);
    },
    onSuccess() {
      setUser(null as unknown as User);
      localStorage.removeItem('accessToken');
    },
    onError(error) {
      showToast('Error', error.message, 'error');
    },
  });

  return logout;
};
