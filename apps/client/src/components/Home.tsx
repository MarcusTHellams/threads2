import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apolloClient } from '../common/apolloClient';
import { PostResponse } from '../common/types';
import Post from '../components/Post';
import { FEED } from '../graphql/queries';
import { useShowToast } from '../hooks/useShowToast';
// import SuggestedUsers from '../components/SuggestedUsers';

export const HomePage = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  }, [queryClient]);

  const {
    data: posts,
    isError,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['feed'],
    async queryFn() {
      return apolloClient
        .query<{ feed: PostResponse[] }>({
          query: FEED,
        })
        .then(({ data: { feed } }) => feed);
      ``;
    },
  });

  useEffect(() => {
    if (isError) {
      showToast('Error', error.message, 'error');
    }
  }, [isError, showToast, error]);

  return (
    <Flex gap="10" alignItems={'flex-start'}>
      <Box flex={70}>
        {!(isFetching || isLoading) && posts?.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}

        {(isLoading || isFetching) && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {posts?.map((post) => (
          <Post key={post.postId} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: 'none',
          md: 'block',
        }}
      >
        {/* <SuggestedUsers /> */}
      </Box>
    </Flex>
  );
};
