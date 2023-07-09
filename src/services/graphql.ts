import { useMutation, useQuery } from "@vue/apollo-composable";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";

// Posts
export const ALL_POSTS_DETAILS = gql`
  fragment PostsDetails on Post {
    id
    title
    cover {
      source
    }
    created_at
  }
`;

export const POST_DETAILS = gql`
  fragment PostDetails on Post {
    id
    title
    content
    created_at
    updated_at
    cover {
      source
    }
  }
`;

export const POSTS_UPDATE_DETAILS = gql`
  fragment PostUpdateDetails on Post {
    id
    title
    content
    created_at
    updated_at
    cover {
      id
      name
      source
    }
  }
`;

export const POST_DATES = gql`
  fragment PostDates on PostsDates {
    dates
  }
`;

export const UPDATE_POST = gql`
  fragment updatePost on updatePostPayload {
    state
  }
`;

// system
export const UPLOAD_IMAGE = gql`
  fragment UploadImage on UploadImagePayload {
    image {
      id
      path
    }
  }
`;

export const ROUTER_USER_VALIDATION = gql`
  fragment RouterUserValidation on UserAuthPayload {
    user {
      user
      is_admin
    }
  }
`;

// auth
export const USER_LOGIN = gql`
  fragment UserLogin on LoginPayload {
    auth {
      access_token
    }
  }
`;

// user
export const USERS_ADMINISTRATION_DETAILS = gql`
  fragment UsersDetails on UserPaginator {
    data {
      id
      name
      email
      is_email_verified
      is_admin
      user
      is_user_disabled
    }
    paginatorInfo {
      currentPage
      lastPage
      hasMorePages
      perPage
      total
    }
  }
`;

export const USER_BASIC_DETAILS = gql`
  fragment UserBasicDetails on UserAuthPayload {
    user {
      id
      name
      user
      email
      image_profile
    }
  }
`;

export const USER_NAME = gql`
  fragment UserName on UserAuthPayload {
    user {
      name
    }
  }
`;

export const USER = gql`
  fragment User on User {
    user {
      name
    }
  }
`;

export const USER_MENU = gql`
  fragment UserMenu on UserAuthPayload {
    user {
      user
      image_profile
    }
  }
`;

export const USER_PERMISSIONS = gql`
  fragment UserPermissions on UserAuthPayload {
    user {
      is_admin
    }
  }
`;

export function graphqlMutationBuilder(params: {
  name: DocumentNode;
  fragment: string;
  mutationName: string;
  inputName?: string;
}): DocumentNode {
  const { name, fragment, mutationName, inputName } = params;
  let query = "" as any;

  if (inputName)
    query = gql`
        mutation ${mutationName}($input:${inputName}){
          ${mutationName}(input: $input){
           ...${fragment}
          }
        }
        ${name}
      `;

  if (!inputName)
    query = gql`
        mutation ${mutationName}{
          ${mutationName}{
           ...${fragment}
          }
        }
        ${name}
      `;

  return query;
}

export async function executeGrapQuery(params: {
  query: any;
  options: { refetch: boolean };
}): Promise<any> {
  const { query, options } = params;
  const { refetch, result } = useQuery(query, null, {
    fetchPolicy: "cache-first",
  });
  if (options.refetch) await refetch();

  return result;
}

export function executeGrapMutation(params: {
  query: any;
  input?: any;
}): Promise<any> {
  const { query, input } = params;
  const { mutate: mutate, onDone, onError } = useMutation(query);

  if (!input) mutate();
  if (input) mutate({ input });

  return new Promise((resolve, reject) => {
    onDone((response) => {
      resolve(response.data);
    });

    onError((error) => reject(error));
  });
}
