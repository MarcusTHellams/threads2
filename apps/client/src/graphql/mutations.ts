import { gql } from '@apollo/client';
import { CORE_POST_FIELDS } from './queries';

export const REMOVE_POST = gql`
  ${CORE_POST_FIELDS}
  mutation REMOVE_POST($id: String!) {
    removePost(id: $id) {
      ...CorePostFields
    }
  }
`;
