import { AxiosError } from "axios";
import {
  DisableUser,
  GetUsers,
  GetUsersResponse,
  SearchUsers,
  SearchUsersParams,
  SearchUsersResponse,
  SearchUsersServerResponse,
  User,
  UserServerResponse,
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
    })) as SearchUsersServerResponse;

    const mappedData = response.data.map(
      (element: UserServerResponse): User => ({
        id: element.id.toString(),
        name: element.name,
        user: element.user,
        email: element.email,
        isAdmin: element.is_admin,
        isEmailVerified: element.is_email_verified,
        isDisabled: element.is_user_disabled,
      }),
    );

    const responseFinal: SearchUsersResponse = {
      currentPage: response.current_page,
      data: mappedData,
      firstPageUrl: response.first_page_url,
      from: response.from,
      lastPage: response.last_page,
      lastPageUrl: response.last_page_url,
      links: response.links,
      nextPageUrl: response.next_page_url,
      perPage: response.per_page,
      path: response.path,
      prevPageUrl: response.prev_page_url,
      to: response.to,
      total: response.total,
    };

    return responseFinal;
  }

  async getUsersPaginated(params: {
    page: number;
    perPage: number;
  }): Promise<SearchUsersServerResponse> {
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

  async updateUserStatus(params: DisableUser): Promise<void> {
    const { id, status } = params;

    try {
      await apiConnector.post({
        url: `update-user-status/`,
        data: { userId: id, status },
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response) {
        throw new Error(e.response.data.error);
      }
      throw e;
    }
  }

  async deleteUserAccount(params: { id: number }): Promise<void> {
    const { id } = params;

    await apiConnector.post({ url: `delete-user/`, data: { id } });
  }
}
