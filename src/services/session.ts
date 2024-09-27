import {
  UserRegister,
  EmailResetPassword,
  ResetPassword,
  UpdateUserPassword,
} from "./interfaces";

import apolloClient from "../Apollo";
import axios from "axios";
import { getUserToken } from "./user";

export async function userRegister(params: UserRegister): Promise<void> {
  const { name, user, password, email } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/upload-image`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      name,
      user,
      password,
      email,
    },
  });
}

export async function userLogin(params: {
  user: string;
  password: string;
}): Promise<{ token: string }> {
  const { user, password } = params;

  const response = await axios.request({
    url: "	http://127.0.0.1:8000/api/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: user,
      password,
    },
  });

  return { token: `Bearer ${response.data.access_token}` };
}

export async function logout(): Promise<void> {
  await axios.request({
    url: "	http://127.0.0.1:8000/api/logout",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
  });
}

export async function sendMailResetPassword(params: {
  email: string;
}): Promise<void> {
  const { email } = params;

  // TODO: pending
  // const response = await axios.request({
  //   url: `http://127.0.0.1:8000/api/upload-image`,
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: getUserToken(),
  //   },
  //   params: {
  //     image,
  //   },
  // });
}

export async function resetPassword(params: ResetPassword): Promise<void> {
  // TODO: pending
  // const response = await axios.request({
  //   url: `http://127.0.0.1:8000/api/upload-image`,
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: getUserToken(),
  //   },
  //   params: {
  //     image,
  //   },
  // });
}

export async function updateUserPassword(
  params: UpdateUserPassword
): Promise<void> {
  // TODO: pending
  // const response = await axios.request({
  //   url: `http://127.0.0.1:8000/api/upload-image`,
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: getUserToken(),
  //   },
  //   params: {
  //     image,
  //   },
  // });
}
