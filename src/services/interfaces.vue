<script lang="ts">
// feedback
interface Feedback {
  userId?: string;
  name?: string;
  email?: string;
  description: string;
  contactMe: boolean;
  type: string;
}

interface FeedbackParams {
  userId?: Feedback["userId"];
  name?: Feedback["name"];
  email?: Feedback["email"];
  description: Feedback["description"];
  contactMe: Feedback["contactMe"];
  error?: any;
  query: string;
  type: Feedback["type"];
}

// posts
interface Post {
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

interface GetPost {
  date: string;
  query: string;
}

interface GetPosts {
  id: Post["id"];
  query: string;
}

interface CreatePost {
  title: Post["title"];
  content: Post["content"];
  coverId: Post["cover"]["id"];
  images: string[];
}

interface UpdatePost {
  id: Post["id"];
  title: Post["title"];
  content: Post["content"];
  coverId: Post["cover"]["id"];
  newCoverId: string;
  images: string[];
  imagesRemoved: string[];
}

interface GetPostsDatesResponse {
  dates: string;
}

interface GetRecentDatePostsResponse {
  date: string;
}

interface DeletePost {
  id: Post["id"];
}

// image
interface GetImage {
  id?: Image["id"];
  name?: Image["name"];
  query: string;
}

interface Image {
  id?: string;
  name?: string;
  path?: string;
  source?: string;
}

interface UploadImage {
  image: any;
  query: string;
}

// system
interface Toast {
  message: string;
  color?: string;
  position?: "top" | "bottom" | "middle";
  duration?: number;
}

interface Theme {
  status: boolean | null;
}

interface Loading {
  message: string;
}

interface AlertConfirmation {
  message: string;
}

interface ModalFeedback {
  error?: object;
  type: "feedback" | "error";
}

// user
interface User {
  id?: string;
  name?: string;
  user?: string;
  password?: string;
  email?: string;
  is_admin?: boolean;
  rol?: Array<any>;
}

interface GetUser {
  query: string;
}

interface UserToken {
  token: string | null;
}

interface UserRegister {
  name: User["name"];
  user: User["user"];
  email: User["email"];
  password: User["password"];
}

interface SetUserData {
  name: User["name"];
  email: User["email"];
  is_admin: User["is_admin"];
  rol: User["rol"];
}

interface GetUserResponse {
  id?: string;
  name?: string;
  user?: string;
  password?: string;
  email?: string;
  is_admin?: boolean;
  rol?: Array<any>;
  image_source?: string;
}

interface GetUserPermissionsResponse {
  admin: User["is_admin"];
  rol: User["rol"];
}

interface UserRegisterResponse {
  name: User["name"];
  user: User["user"];
  email: User["email"];
  password: User["password"];
}

interface UserLogin {
  user: User["user"];
  password: User["password"];
  query: string;
}

interface UserLoginResponse {
  user: User;
  auth: {
    access_token: string;
    token_type: string;
  };
}

interface EmailResetPassword {
  email: string;
}

interface CodeResetPassword {
  email: string;
  code: string;
}

interface ResetPassword {
  email: string;
  password: string;
}

interface SaveUserData {
  name: string;
  user: string;
  email: string;
  imageId?: string;
}

interface UpdateUserPassword {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}
interface DeleteUserAccount {
  password: string;
}

export {
  Feedback,
  Post,
  UpdatePost,
  GetImage,
  DeletePost,
  Toast,
  User,
  CreatePost,
  GetPost,
  GetPosts,
  UserRegister,
  UserLogin,
  EmailResetPassword,
  CodeResetPassword,
  ResetPassword,
  Theme,
  Loading,
  AlertConfirmation,
  UserToken,
  GetUser,
  Image,
  UploadImage,
  FeedbackParams,
  GetRecentDatePostsResponse,
  GetPostsDatesResponse,
  UserRegisterResponse,
  SetUserData,
  GetUserResponse,
  GetUserPermissionsResponse,
  UserLoginResponse,
  ModalFeedback,
  SaveUserData,
  UpdateUserPassword,
  DeleteUserAccount,
};
</script>
