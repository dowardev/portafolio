import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import { SearchUsersResponse, User } from "../services/interfaces";
import { deleteUserAccount } from "../services/user";

import {
  searchUsers,
  getUsersPaginated as getUsersPaginated2,
} from "../services/admin";

// controllers
import SystemController from "./systemController";
const systemController = new SystemController();

export default class UserController {
  usersStore = useUsersStore();
  users = storeToRefs(this.usersStore).users;
  openToastError = systemController.openToastError;

  async loadUsers(params: {
    paginatorInfo: { pagination: number; page: number };
    search: string;
    filterOptions: string;
  }): Promise<SearchUsersResponse> {
    const first = params.paginatorInfo.pagination;
    const page = params.paginatorInfo.page;
    const search = params.search;
    const filterOptions = params.filterOptions;

    try {
      const response = await searchUsers({
        first,
        page,
        search,
        filterOptions,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      this.openToastError(error);
      throw error;
    }
  }

  async getUsersPaginated(params: {
    page: number;
    perPage: number;
  }): Promise<SearchUsersResponse> {
    const { page, perPage } = params;

    try {
      const response = await getUsersPaginated2({
        page,
        perPage,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      this.openToastError(error);
      throw error;
    }
  }

  updateUsers(params: { users: Array<User> }) {
    const users = params.users;
    this.usersStore.updateUsersProps({ users });
  }

  async deleteAccount(params: { password: string }) {
    try {
      await deleteUserAccount({
        password: params.password,
      });
    } catch (e: any) {
      throw e;
    }
  }
}
