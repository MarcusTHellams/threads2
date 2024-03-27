import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useShowToast } from '../../hooks/useShowToast';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { object, string, InferType } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../common/api';
import { AuthResponse } from '../../common/types';

const schema = object({
  email: string().email().required('Email is Required'),
  password: string().required('Password is Required'),
});

type SignInType = InferType<typeof schema>;

export function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useAuthStore(({ setAuth }) => setAuth);
  const setUser = useUserStore(({ setUser }) => setUser);
  const user = useUserStore(({ user }) => user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SignInType>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user && isSubmitted) {
      navigate('/', { replace: true });
    }
  }, [user, navigate, isSubmitted]);

  const { mutate, isPending } = useMutation<AuthResponse, Error, SignInType>({
    mutationKey: ['login'],
    async mutationFn(values) {
      return api.post('auth/signin', values).then((resp) => resp.data);
    },
    onSuccess(data) {
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
    },
    onError(error) {
      console.log('error: ', error);
      showToast('Error', error.message, 'error');
    },
  });

  const submitHandler = handleSubmit((values) => {
    mutate(values);
  });

  const showToast = useShowToast();

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: 'full',
            sm: '400px',
          }}
        >
          <Stack spacing={4}>
            <form noValidate onSubmit={submitHandler}>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register('email')} />
                {errors.email ? (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password ? (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Logging in"
                  size="lg"
                  bg={useColorModeValue('gray.600', 'gray.700')}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue('gray.700', 'gray.800'),
                  }}
                  type="submit"
                  isLoading={isPending}
                >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don&apos;t have an account?{' '}
                  <Link
                    color={'blue.400'}
                    onClick={() => setAuthScreen('signup')}
                  >
                    Sign up
                  </Link>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
