import {
  DisableUser,
  GetUsers,
  GetUsersResponse,
  SearchUsers,
  SearchUsersResponse,
} from "./interfaces";

import { getUserToken } from "./user";
import axios from "axios";

export async function getUsers(params: GetUsers): Promise<GetUsersResponse> {
  const { page, first } = params;

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/users`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: getUserToken(),
    },
  });

  return {
    users: response.data.users,
    paginatorInfo: response.data.paginatorInfo,
  };
}

export async function searchUsers(
  params: SearchUsers
): Promise<SearchUsersResponse> {
  const { page, search, filterOptions } = params;

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/search-user/`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: getUserToken(),
    },
  });

  // const users = response.data.data;

  const users = response.data.users.map((element: any) => {
    element.isAdmin = element.is_admin;
    delete element.is_admin;

    element.isEmailVerified = element.is_email_verified;
    delete element.is_email_verified;

    element.isUserDisabled = element.is_user_disabled;
    delete element.is_user_disabled;
    return element;
  });

  return {
    users,
    paginatorInfo: response.data.paginatorInfo,
  };
}

export async function getUsersPaginated(params: {
  page: number;
  perPage: number;
}): Promise<SearchUsersResponse> {
  const { page, perPage: perpage } = params;
  const path =
    page == 1
      ? `http://127.0.0.1:8000/api/search-user/${perpage}`
      : `http://127.0.0.1:8000/api/search-user?page=${page}`;

  const response = await axios.request({
    url: path,
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: getUserToken(),
    },
  });

  const users = response.data.data.map((element: any) => {
    element.isAdmin = element.is_admin;
    delete element.is_admin;

    element.isEmailVerified = element.is_email_verified;
    delete element.is_email_verified;

    element.isUserDisabled = element.is_user_disabled;
    delete element.is_user_disabled;
    return element;
  });

  const totalPages = response.data.last_page;

  return {
    users,
    paginatorInfo: { totalPages },
  };
}

export async function disableUser(params: DisableUser): Promise<void> {
  const { id, disableUser } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/disable-user/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      id,
      disableUser,
    },
  });
  axios;
}

export async function deleteUserAccount(params: { id: number }): Promise<void> {
  const { id } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/delete-user/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      id,
    },
  });
}
