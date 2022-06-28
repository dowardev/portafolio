import gql from "graphql-tag";

// Posts
export const ALL_POSTS_DETAILS = gql`
  fragment PostsDetails on Post {
    id
    title
    cover {
      source
    }
  }
`;

export const POST_DETAILS = gql`
  fragment PostDetails on Post {
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

// system
export const UPLOAD_IMAGE = gql`
  fragment UploadImage on UploadImagePayload {
    image {
      id
      name
      source
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
