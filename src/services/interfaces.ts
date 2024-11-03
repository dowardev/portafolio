import { DocumentNode } from "graphql";
import { ThemeType } from "@/utils/types.ts";

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
  createdAt?: string;
  updatedAt?: string;
  cover: {
    id?: string;
    name?: string;
    path?: string;
  };
}
export interface GetPost {
  date: string;
}

export interface CreatePost {
  title: Post["title"];
  content: Post["content"];
  coverId: Post["cover"]["id"];
  images: string[];
}

export interface UpdatePost {
  id: string;
  title: string;
  content: string;
  cover: {
    newCoverId: string;
    oldCoverId: string;
  };
  images: string[];
  imagesRemoved: string[];
}

export interface GetPostsDates {
  graphql: Graphql;
  refetch?: boolean;
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
}

// system
export interface Toast {
  message: string;
  color?: string;
  position?: "top" | "bottom" | "middle";
  duration?: number;
}

export interface Loading {
  message: string;
}

export interface AlertConfirmation {
  message: string;
}

export interface ReportError {
  error?: any;
  type: "feedback" | "error";
}

// user
export interface User {
  id?: string;
  name?: string;
  user?: string;
  password?: string;
  email?: string;
  isAdmin?: boolean;
  rol?: Array<any>;
  isEmailVerified?: boolean;
  isDisabled?: boolean;
  imageProfile?: string;
}

export interface GetUser {
  graphql: Graphql;
}

// export interface GetUserResponse {
//   id?: User["id"];
//   name?: User["user"];
//   email?: User["email"];
//   user?: User["user"];
//   imageProfile?: User["image_profile"];
//   isAdmin?: User["is_admin"];
// }

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
  is_admin: User["isAdmin"];
  rol: User["rol"];
}

export interface GetUserPermissionsResponse {
  admin: User["isAdmin"];
  rol: User["rol"];
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
export interface SearchUsers {
  first: number;
  page: number;
  search?: string;
  filterOptions: string;
}
export interface SearchUsersResponse {
  users: Array<User>;
  paginatorInfo: {
    totalPages: number;
  };
}
export interface DisableUser {
  id: string;
  disableUser: boolean;
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
