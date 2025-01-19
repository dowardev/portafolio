import SystemService from "@/services/systemService";
import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import {
  DisableUser,
  SearchUsersParams,
  SearchUsersServerResponse,
  User,
  UserRegister,
} from "../services/interfaces";

// services
import UserService from "../services/userService";
import AdminService from "../services/adminService";
import SessionService from "@/services/sessionService";
import { useUserStore } from "@/store/userStore";

export default class UserController {
  private usersStore = useUsersStore();
  private userService = new UserService();
  private adminService = new AdminService();
  private sessionService = new SessionService();
  private systemService = new SystemService();
  private userStore = useUserStore();
  private userRefs = storeToRefs(this.userStore);

  async loadUsers(
    params: SearchUsersParams,
  ): Promise<SearchUsersServerResponse> {
    const { search, pagination, page, options } = params;

    try {
      const response = await this.adminService.searchUsers({
        search,
        pagination,
        page,
        options,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.error("Unauthorized user");
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
      return { id: id ?? "", path: path ?? "", name: name ?? "" };
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

  async updateUserStatus(params: DisableUser): Promise<void> {
    const { id, status } = params;
    await this.adminService.updateUserStatus({ id, status });
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
    const { user } = params;
    this.userStore.updateUserProps(user);
  }

  getUser(): User | undefined {
    return this.userRefs.user.value ?? undefined;
  }

  async recoverPassword(params: { email: string }) {
    const { email } = params;

    try {
      await this.sessionService.recoverPassword({ email });
    } catch (error: any) {
      throw error;
    }
  }

  async sendNewPassword(params: {
    email: string;
    code: number;
    password: string;
  }) {
    const { code, password, email } = params;

    try {
      await this.sessionService.sendNewPassword({ code, password, email });
    } catch (error: any) {
      throw error;
    }
  }

  getUsersLoaded() {
    return this.usersStore.getUsers();
  }
}
