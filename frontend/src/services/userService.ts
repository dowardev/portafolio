import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import { AxiosError } from "axios";
import { apiConnector, ssoApiConnector } from "@/main";

import {
  SaveUserData,
  User,
  UserServerResponse,
  AdminDeleteUserAccount,
  DisableUser,
  GetUsersResponse,
  SearchUsersParams,
  SearchUsersResponse,
  SearchUsersServerResponse,
} from "../utils/interfaces";

export default class UserService {
  async getUser(): Promise<User | undefined> {
    const response = (await apiConnector.get({
      url: `user-auth`,
    })) as UserServerResponse;

    if (response) return this.formatUserResponse({ response });
    else return undefined;
  }

  async setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  async saveUserData(params: SaveUserData): Promise<void> {
    const { name, user, email, imageId } = params;

    await apiConnector.post({
      url: `update-user`,
      data: { name, user, email, imageId },
    });
  }

  async deleteUserAccount(params: { password: string }): Promise<void> {
    const { password } = params;

    await apiConnector.post({
      url: `delete-user`,
      data: { password },
    });
  }

  async resendEmailConfirmation(params: { password: string }): Promise<void> {
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

  async getUsers(): Promise<GetUsersResponse> {
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
      (element: UserServerResponse): User =>
        this.formatUserResponse({ response: element }) as User,
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

  async adminDeleteUserAccount(params: AdminDeleteUserAccount): Promise<void> {
    const { id, email } = params;

    try {
      await apiConnector.post({
        url: `admin/delete-user/`,
        data: { id, email },
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response) {
        throw new Error(e.response.data.error);
      }
      throw e;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatUserResponse(params: { response: any }): User {
    const { response } = params;

    return {
      id: response.id?.toString(),
      name: response.name,
      user: response.user,
      email: response.email,
      isAdmin: response.is_admin,
      roles: response.roles ?? [],
      isEmailVerified: response.is_email_verified,
      isDisabled: response.is_user_disabled,
      imageProfile: response.image_profile,
    };
  }
}
