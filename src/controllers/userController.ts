import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import { SearchUsersResponse, User } from "../services/interfaces";

// controllers
// import SystemController from "./systemController";
// const systemController = new SystemController();

// services
import UserService from "../services/userService";
import AdminService from "../services/adminService";

export default class UserController {
  usersStore = useUsersStore();
  users = storeToRefs(this.usersStore).users;
  // openToastError = systemController.openToastError;
  userService = new UserService();
  adminService = new AdminService();

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
      const response = await this.adminService.searchUsers({
        first,
        page,
        search,
        filterOptions,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      // this.openToastError(error);
      throw error;
    }
  }

  async getUsersPaginated(params: {
    page: number;
    perPage: number;
  }): Promise<SearchUsersResponse> {
    const { page, perPage } = params;

    try {
      const response = await this.adminService.getUsersPaginated({
        page,
        perPage,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      // this.openToastError(error);
      throw error;
    }
  }

  updateUsers(params: { users: Array<User> }) {
    const users = params.users;
    this.usersStore.updateUsersProps({ users });
  }

  async deleteAccount(params: { password: string }) {
    try {
      await this.userService.deleteUserAccount({
        password: params.password,
      });
    } catch (e: any) {
      throw e;
    }
  }
}
