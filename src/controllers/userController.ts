import SystemService from "@/services/systemService";
import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import {
  DisableUser,
  SearchUsersResponse,
  User,
  UserRegister,
} from "../services/interfaces";

// services
import UserService from "../services/userService";
import AdminService from "../services/adminService";
import SessionService from "@/services/sessionService";
import { useUserStore } from "@/store/userStore";

export default class UserController {
  usersStore = useUsersStore();
  users = storeToRefs(this.usersStore).users;
  // openToastError = systemController.openToastError;
  userService = new UserService();
  adminService = new AdminService();
  sessionService = new SessionService();
  systemService = new SystemService();
  userStore = useUserStore();
  user = storeToRefs(this.userStore);

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

  async createUserAccount(params: UserRegister) {
    const { name, user, password, email } = params;

    await this.sessionService.userRegister({ name, user, password, email });
  }

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<{ id: string; path: string; name: string }> {
    const { image, type } = params;
    try {
      const { id, path, name } = await this.systemService.uploadImage({
        image,
        type,
      });
      return { id, path, name };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async saveUserData(params: {
    name: string;
    user: string;
    email: string;
    imageId: string;
  }): Promise<void> {
    const { name, user, email, imageId } = params;

    await this.userService.saveUserData({ name, user, email, imageId });
  }

  async disableUser(params: DisableUser): Promise<void> {
    const { id, disableUser } = params;
    await this.adminService.disableUser({ id, disableUser });
  }

  async deleteUserAccount(params: { id: number }): Promise<void> {
    const { id } = params;
    await this.adminService.deleteUserAccount({ id });
  }

  async login(params: {
    user: string;
    password: string;
  }): Promise<{ token: string }> {
    const { user, password } = params;
    return await this.sessionService.userLogin({ user, password });
  }

  async loadUser() {
    try {
      const user = await this.userService.getUser();

      this.updateUserProps({ user });
    } catch (error: any) {
      if (error.message != "Unauthorized") throw error;
    }
  }

  updateUserProps(params: { user: User }) {
    this.userStore.updateUserProps(params.user);
  }
}
