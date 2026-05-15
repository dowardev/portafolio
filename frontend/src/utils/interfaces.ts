import {
  EmailFilterOption,
  Theme as ThemeType,
  UserFilterOption,
  UserRolFilterOption,
} from "@/utils/types";
import { filterPostOptions, PostFields, StatusPost } from "./types";

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
  name: Feedback["name"];
  email: Feedback["email"];
  description: Feedback["description"];
  contactMe: Feedback["contactMe"];
}

// posts
export interface Post {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  cover?: {
    id: number;
    name: string;
    url: string;
  };
  status: StatusPost;
}

export interface GetPost {
  date: string;
  filter?: filterPostOptions;
}

export interface GetPostsServer {
  date: string;
  filter?: filterPostOptions;
  fields?: PostFields[];
}

export interface CreatePost {
  title: Post["title"];
  content: Post["content"];
  coverId: Post["cover"]["id"];
  images: string[];
  status: StatusPost;
}

export interface UpdatePost {
  id: number;
  title: string;
  content: string;
  coverId: number | undefined;
  images: string[];
  imagesRemoved: string[];
  status: StatusPost;
}

export interface GetPostsDates {
  refetch?: boolean;
}

export interface PostServerResponse {
  post: {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    status: string;
    cover: PostCoverServerResponse;
  };
}

export interface PostCoverServerResponse {
  id: number;
  name: string;
  url: string;
}
// end posts

// image
export interface GetImage {
  id?: Image["id"];
  name?: Image["name"];
}

export interface Image {
  id?: string;
  name?: string;
  url?: string;
}
export interface ImageServer {
  id?: string;
  name?: string;
  url?: string;
}

export interface UploadImage {
  image: File;
  type: string;
}

// system
export interface Toast {
  message: string;
  color?: string;
  position?: "top" | "bottom" | "middle";
  duration?: number;
  buttons?: Array<{
    text: string;
    role?: string;
    handler?: () => Promise<boolean | void>;
  }>;
}

export interface Loading {
  message: string;
}

export interface AlertConfirmation {
  message: string;
}

// user
export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_protected: boolean;
}

export interface User {
  id?: string;
  name?: string;
  user?: string;
  password?: string;
  email?: string;
  roles?: Role[];
  isEmailVerified?: boolean;
  isDisabled?: boolean;
  imageProfile?: string;
}

export interface UserServerResponse {
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  image_id: string | null;
  is_email_verified: boolean;
  is_user_disabled: boolean;
  name: string;
  role: string | null;
  updated_at: string;
  user: string;
  roles?: Role[];
}

// export interface GetUserResponse {
//   id?: User["id"];
//   name?: User["user"];
//   email?: User["email"];
//   user?: User["user"];
//   imageProfile?: User["image_profile"];
// }

export interface UserToken {
  token: string | null;
}

export interface UserRegister {
  name: User["name"];
  user: User["user"];
  email: User["email"];
  password: User["password"];
  password_confirmation?: string;
  client_id?: string;
}

export interface UpdateUserAccount {
  id: string;
  name: string;
  user: string;
  email: string;
}

export interface SetUserData {
  name: User["name"];
  email: User["email"];
  roles: Role[];
}

export interface GetUserPermissionsResponse {
  roles: Role[];
}

export interface MyPermissionsResponse {
  roles: string[];
  permissions: Record<string, boolean>;
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

export interface SignUpUserServerResponse {
  id: number;
  name: string;
  user: string;
  email: string;
  updated_at: string;
  created_at: string;
}
export interface SignUpUserResponse {
  id: number;
  name: string;
  user: string;
  email: string;
}
// end user
// admin
export interface GetUsers {
  first: number;
  page: number;
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
export interface SearchUsersParams {
  pagination?: number;
  search?: string;
  page: number;
  options: FilterAdminPanelOptions;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface SearchUsersServerResponse {
  current_page: number;
  data: UserServerResponse[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface SearchUsersResponse {
  currentPage: number;
  data: User[];
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  links: Link[];
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
}

export interface DisableUser {
  id: string;
  status: boolean;
}

export interface AdminDeleteUserAccount {
  id?: string;
  email: string;
}

// contact
export interface ContactMessage {
  name: string;
  subject: string;
  email: string;
  description: string;
}

// system
export interface System {
  theme: Theme;
}

export interface Theme {
  selected: ThemeType;
  options?: { blur?: boolean };
}

export interface FilterAdminPanelOptions {
  email: EmailFilterOption;
  user: UserFilterOption;
  rol: UserRolFilterOption;
}

export interface CustomAxiosErrorInterface {
  message: string;
  statusCode: number;
}

export interface ICustomError {
  status?: number;
  errorDetail?: string;
  cause?: Error;
}
