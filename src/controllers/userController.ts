import SystemService from "@/services/systemService";
import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import {
  AdminDeleteUserAccount,
  DisableUser,
  SearchUsersParams,
  SearchUsersServerResponse,
  SignUpUserResponse,
  UpdateUserAccount,
  User,
  UserRegister,
} from "../services/interfaces";
import Cookies from "js-cookie";

// controllers
import ErrorController from "./errorController";
// import { auth } from "@/main";

// services
import UserService from "../services/userService";
import SessionService from "@/services/sessionService";
import { useUserStore } from "@/store/userStore";

export default class UserController {
  private usersStore = useUsersStore();
  private userService = new UserService();
  private sessionService = new SessionService();
  private systemService = new SystemService();
  private errorController = new ErrorController();
  private userStore = useUserStore();
  private userRefs = storeToRefs(this.userStore);

  async loadUsers(
    params: SearchUsersParams,
  ): Promise<SearchUsersServerResponse | void> {
    const { search, pagination, page, options } = params;

    try {
      const response = await this.userService.searchUsers({
        search,
        pagination,
        page,
        options,
      });

      return response;
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  updateUsers(params: { users: Array<User> }) {
    try {
      const users = params.users;
      this.usersStore.updateUsersProps({ users });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async deleteAccount(params: { password: string }) {
    try {
      await this.userService.deleteUserAccount({
        password: params.password,
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async createUserAccount(params: UserRegister): Promise<void> {
    try {
      const { name, user, password, email } = params;

      await this.sessionService.userRegister({
        name,
        user,
        password,
        email,
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async updateUserAccount(params: UpdateUserAccount): Promise<void> {
    try {
      const { id, name, user, email } = params;

      await this.sessionService.updateUserAccount({
        id,
        name,
        user,
        email,
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<{ id: string; path: string; name: string } | void> {
    const { image, type } = params;
    try {
      const { id, path, name } = await this.systemService.uploadImage({
        image,
        type,
      });
      return { id: id ?? "", path: path ?? "", name: name ?? "" };
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async saveUserData(params: {
    name: string;
    user: string;
    email: string;
    imageId: string;
  }): Promise<void> {
    try {
      const { name, user, email, imageId } = params;

      await this.userService.saveUserData({ name, user, email, imageId });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async updateUserStatus(params: DisableUser): Promise<void> {
    try {
      const { id, status } = params;
      await this.userService.updateUserStatus({ id, status });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async deleteUserAccount(params: AdminDeleteUserAccount): Promise<void> {
    try {
      const { id, email } = params;
      await this.userService.adminDeleteUserAccount({ id, email });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async login(params: {
    user: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string } | void> {
    try {
      const { user, password } = params;
      return await this.sessionService.userLogin({ user, password });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async loadUser() {
    try {
      const user = await this.userService.getUser();

      if (user) this.updateUserProps({ user });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  updateUserProps(params: { user: User }) {
    try {
      const { user } = params;
      this.userStore.updateUserProps(user);
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getUser(): User | void {
    try {
      return this.userRefs.user.value ?? undefined;
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async recoverPassword(params: { email: string }) {
    const { email } = params;

    try {
      await this.sessionService.recoverPassword({ email });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
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
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getUsersLoaded() {
    try {
      return this.usersStore.getUsers();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  refreshUserToken(params: { refreshToken: string }) {
    try {
      const { refreshToken } = params;
      this.sessionService.refreshAuthToken({ refreshToken });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  storeUserToken(params: { token: string }) {
    const { token } = params;
    Cookies.set("access-token", token, {
      secure: true,
      sameSite: "Strict",
    });
  }

  storeRefreshToken(params: { refreshToken: string }) {
    const { refreshToken } = params;
    Cookies.set("refresh-token", refreshToken, {
      secure: true,
      sameSite: "Strict",
    });
  }
}
