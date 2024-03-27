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
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useShowToast } from '../../hooks/useShowToast';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { object, string, InferType } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../common/api';
import { AuthResponse } from '../../common/types';
import { useNavigate } from 'react-router-dom';

const schema = object({
  name: string().required('Name is Required'),
  email: string().email().required('Email is Required'),
  password: string().required('Password is Required'),
});

type SignUpType = InferType<typeof schema>;

export function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useAuthStore((state) => state.setAuth);
  const setUser = useUserStore(({ setUser }) => setUser);
  const user = useUserStore(({ user }) => user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SignUpType>({
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useMutation<AuthResponse, Error, SignUpType>({
    mutationKey: ['signUp'],
    async mutationFn(values) {
      return api.post('/auth/signup', values).then((resp) => resp.data);
    },
    onSuccess(data) {
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
    },
    onError(error) {
      showToast('Error', error.message, 'error');
    },
  });

  const submitHandler = handleSubmit((values) => mutate(values));

  const showToast = useShowToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && isSubmitted) {
      navigate('/', { replace: true });
    }
  }, [user, isSubmitted, navigate]);

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
        >
          <form noValidate onSubmit={submitHandler}>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Username</FormLabel>
                <Input type="text" {...register('name')} />
                {errors.name ? (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
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
                  isLoading={isPending}
                  loadingText="Submitting"
                  size="lg"
                  bg={useColorModeValue('gray.600', 'gray.700')}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue('gray.700', 'gray.800'),
                  }}
                  type="submit"
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link
                    color={'blue.400'}
                    onClick={() => setAuthScreen('login')}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
