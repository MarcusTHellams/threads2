import { gql } from '@apollo/client';

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    bio
    createdAt
    email
    isFrozen
    name
    profilePic
    updatedAt
    userId
  }
`;

export const CORE_POST_FIELDS = gql`
  fragment CorePostFields on Post {
    createdAt
    image
    postId
    text
    updatedAt
    userId
  }
`;

export const GET_USER = gql`
  ${CORE_USER_FIELDS}
  query GET_USER($id: String!) {
    user(id: $id) {
      ...CoreUserFields
      followers {
        ...CoreUserFields
      }
      follows {
        ...CoreUserFields
      }
    }
  }
`;
