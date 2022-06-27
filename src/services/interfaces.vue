<script lang="ts">
import { DocumentNode } from "graphql";

interface Graphql {
  name: DocumentNode;
  fragment: string;
  refetch?: boolean;
}

// feedback
export interface Feedback {
  userId?: string;
  name?: string;
  email?: string;
  description: string;
  contactMe: boolean;
  type: string;
}

export interface FeedbackParams {
  userId?: Feedback["userId"];
  name?: Feedback["name"];
  email?: Feedback["email"];
  description: Feedback["description"];
  contactMe: Feedback["contactMe"];
  error?: any;
  type: Feedback["type"];
}

// posts
export interface Post {
  id?: string;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  cover: {
    id?: string;
    name?: string;
    path?: string;
    source?: string;
  };
}
export interface GetPost {
  date: string;
  refetch?: boolean;
  graphql: Graphql;
}

export interface GetPosts {
  id: Post["id"];
  graphql: Graphql;
}

export interface CreatePost {
  title: Post["title"];
  content: Post["content"];
  coverId: Post["cover"]["id"];
  images: string[];
}

export interface UpdatePost {
  id: Post["id"];
  title: Post["title"];
  content: Post["content"];
  coverId: Post["cover"]["id"];
  newCoverId: string;
  images: string[];
  imagesRemoved: string[];
}

export interface GetPostsDates {
  graphql: Graphql;
  refetch?: boolean;
}

export interface GetPostsDatesResponse {
  dates: string;
}

export interface DeletePost {
  id: Post["id"];
}

// image
export interface GetImage {
  id?: Image["id"];
  name?: Image["name"];
}

export interface Image {
  id?: string;
  name?: string;
  path?: string;
  source?: string;
}

export interface UploadImage {
  image: any;
  graphql: Graphql;
}

// system
export interface Toast {
  message: string;
  color?: string;
  position?: "top" | "bottom" | "middle";
  duration?: number;
}

export interface Theme {
  theme: "aut" | "light" | "dark";
}

export interface Loading {
  message: string;
}

export interface AlertConfirmation {
  message: string;
}

export interface ModalFeedback {
  error?: object;
  type: "feedback" | "error";
}

// user
export interface User {
  id?: string;
  name?: string;
  user?: string;
  password?: string;
  email?: string;
  is_admin?: boolean;
  rol?: Array<any>;
  is_email_verified?: boolean;
  is_user_disabled?: boolean;
  image_profile: string;
}

export interface GetUser {
  graphql: Graphql;
}

export interface GetUserResponse {
  id?: User["id"];
  name?: User["user"];
  email?: User["email"];
  user?: User["user"];
  image_profile?: User["image_profile"];
  is_admin?: User["is_admin"];
}

export interface UserToken {
  token: string | null;
}

export interface UserRegister {
  name: User["name"];
  user: User["user"];
  email: User["email"];
  password: User["password"];
}

export interface SetUserData {
  name: User["name"];
  email: User["email"];
  is_admin: User["is_admin"];
  rol: User["rol"];
}

export interface GetUserPermissionsResponse {
  admin: User["is_admin"];
  rol: User["rol"];
}

export interface UserLogin {
  user: User["user"];
  password: User["password"];
  graphql: Graphql;
}

export interface UserLoginResponse {
  user?: User;
  auth: {
    access_token?: string;
    token_type?: string;
  };
}

export interface EmailResetPassword {
  email: string;
}

export interface ResetPassword {
  code: string;
  email: string;
  password: string;
}

export interface SaveUserData {
  name: string;
  user: string;
  email: string;
  imageId?: string;
}

export interface UpdateUserPassword {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}
export interface DeleteUserAccount {
  password: string;
}
export interface ResendEmailConfirmation {
  email: string;
}

// admin
export interface GetUsers {
  first: number;
  page: number;
  graphql: Graphql;
}
export interface GetUsersResponse {
  users: Array<User>;
  paginatorInfo: {
    currentPage: number;
    lastPage: number;
    hasMorePages: boolean;
    total: number;
  };
}
export interface SearchUsers {
  first: number;
  page: number;
  name?: string;
  email?: string;
  graphql: Graphql;
}
export interface SearchUsersResponse {
  users: Array<User>;
  paginatorInfo: {
    currentPage: number;
    lastPage: number;
    hasMorePages: boolean;
    total: number;
  };
}
export interface DisableUser {
  id: string;
  disableUser: boolean;
}
export interface DeleteUserAccountAdmin {
  email: string;
}
</script>
