/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from '@chakra-ui/avatar';
import { Image } from '@chakra-ui/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Link, useNavigate } from 'react-router-dom';
import Actions from './Actions';
import { useEffect } from 'react';
import { useShowToast } from '../hooks/useShowToast';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apolloClient } from '../common/apolloClient';
import { GET_USER } from '../graphql/queries';
import { PostResponse, UserResponse } from '../common/types';
import { REMOVE_POST } from '../graphql/mutations';

type PostComponentType = {
  post: PostResponse;
  postedBy: any;
};

const Post = ({ post, postedBy }: PostComponentType) => {
  const showToast = useShowToast();
  const currentUser = useUserStore(({ user }) => user);
  const { posts, setPosts } = usePostStore((state) => state);
  const navigate = useNavigate();

  const { data: user, error } = useQuery({
    queryKey: ['user', postedBy],
    async queryFn() {
      return apolloClient
        .query<{ user: UserResponse }>({
          query: GET_USER,
          variables: {
            id: postedBy,
          },
        })
        .then(({ data: { user } }) => user);
    },
  });

  useEffect(() => {
    showToast('Error', error!.message, 'error');
  }, [error, showToast]);

  const { mutate: removePost } = useMutation<PostResponse, Error, string>({
    mutationKey: ['removePost'],
    async mutationFn(id) {
      return apolloClient
        .mutate<{ removePost: PostResponse }>({
          mutation: REMOVE_POST,
          variables: {
            id,
          },
        })
        .then((resp) => resp.data!.removePost);
    },
    onSuccess() {
      showToast('Success', 'Post deleted', 'success');
      setPosts(posts.filter((p) => p.postId !== post.postId));
    },
    onError(error) {
      showToast('Error', error.message, 'error');
    },
  });

  const handleDeletePost = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    removePost(post.postId);
  };

  if (!user) return null;
  return (
    <Link to={`/${user.name}/post/${post.postId}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.name}`);
            }}
          />
          <Box w="1px" h={'full'} bg="gray.light" my={2}></Box>
          <Box position={'relative'} w={'full'}>
            {post.replies.length === 0 && <Text textAlign={'center'}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={'absolute'}
                top={'0px'}
                left="15px"
                padding={'2px'}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={'absolute'}
                bottom={'0px'}
                right="-5px"
                padding={'2px'}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={'absolute'}
                bottom={'0px'}
                left="4px"
                padding={'2px'}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'} w={'full'}>
            <Flex w={'full'} alignItems={'center'}>
              <Text
                fontSize={'sm'}
                fontWeight={'bold'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.name}`);
                }}
              >
                {user?.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={'center'}>
              <Text
                fontSize={'xs'}
                width={36}
                textAlign={'right'}
                color={'gray.light'}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?.userId === user.userId && (
                <DeleteIcon boxSize={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>

          <Text fontSize={'sm'}>{post.text}</Text>
          {post.image && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid'}
              borderColor={'gray.light'}
            >
              <Image src={post.image} w={'full'} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
