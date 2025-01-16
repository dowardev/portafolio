import {
  DisableUser,
  GetUsers,
  GetUsersResponse,
  SearchUsers,
  SearchUsersParams,
  SearchUsersResponse,
} from "./interfaces";
import { apiConnector } from "@/main";

export default class AdminService {
  async getUsers(params: GetUsers): Promise<GetUsersResponse> {
    const { page, first } = params;

    const response = await apiConnector.get({ url: `users` });

    return {
      users: response.users,
      paginatorInfo: response.paginatorInfo,
    };
  }

  async searchUsers(params: SearchUsersParams): Promise<SearchUsersResponse> {
    const { search, pagination, page, options } = params;

    const response = (await apiConnector.get({
      url: `users`,
      data: { search, pagination, page, options: JSON.stringify(options) },
    })) as SearchUsersResponse;

    return response;
  }

  async getUsersPaginated(params: {
    page: number;
    perPage: number;
  }): Promise<SearchUsersResponse> {
    const { page, perPage: perpage } = params;
    const path =
      page == 1
        ? `http://127.0.0.1:8000/api/search-user/${perpage}`
        : `http://127.0.0.1:8000/api/search-user?page=${page}`;

    const response = await apiConnector.get({ url: path });

    const users = response.data.map((element: any) => {
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

  async disableUser(params: DisableUser): Promise<void> {
    const { id, disableUser } = params;

    await apiConnector.get({ url: `disable-user/`, data: { id, disableUser } });
  }

  async deleteUserAccount(params: { id: number }): Promise<void> {
    const { id } = params;

    await apiConnector.post({ url: `delete-user/`, data: { id } });
  }
}
