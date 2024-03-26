import { useAuthStore } from '../stores/authStore';
import { LoginCard } from './components/LoginCard';
import { SignupCard } from './components/SignupCard';

export const Auth = () => {
	const authScreenState = useAuthStore(({ auth }) => auth);

	return <>{authScreenState === 'login' ? <LoginCard /> : <SignupCard />}</>;
};
