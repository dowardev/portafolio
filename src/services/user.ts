import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import {
  SaveUserData,
  UserToken,
  DeleteUserAccount,
  ResendEmailConfirmation,
  User,
} from "./interfaces";

import axios from "axios";

export function setUserToken({ token }: UserToken): void {
  document.cookie = "token=" + token;
}

export function getUserToken(): string {
  const name = "token=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let token = "";
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) token = val.substring(name.length);
  });
  return token;
}

export async function getUser(): Promise<User> {
  try {
    const response = await axios.request({
      url: "http://127.0.0.1:8000/api/user-auth",
      method: "GET",
      headers: {
        Authorization: getUserToken(),
      },
    });

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      user: response.data.user,
      imageProfile: response.data.image_profile,
      isAdmin: response.data.is_admin,
    };
  } catch (error: any) {
    if (error.response.data.message == "Unauthenticated.")
      throw new Error("Unauthorized");
    throw error;
  }
}

export async function setUserUploaded(option: boolean | null) {
  await store.set("user-uploaded", option);
}

export async function saveUserData(params: SaveUserData): Promise<void> {
  const { name, user, email, imageId } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/update-user`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      name,
      user,
      email,
      imageId,
    },
  });
}

export async function deleteUserAccount(params: {
  password: string;
}): Promise<void> {
  const { password } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/delete-user`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      password,
    },
  });
}

export async function resendEmailConfirmation(params: {
  password: string;
}): Promise<void> {
  const { password } = params;

  // // TODO: Pending
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
