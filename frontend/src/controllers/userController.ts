import SystemService from "@/services/systemService";
import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import {
  AdminDeleteUserAccount,
  DisableUser,
  ICustomError,
  SearchUsersParams,
  SearchUsersServerResponse,
  SignUpUserResponse,
  UpdateUserAccount,
  User,
  UserRegister,
} from "../utils/interfaces";
import Cookies from "js-cookie";
import { apiConnector, ssoApiConnector, serverConfigController } from "@/main";

// controllers
import ErrorController from "./errorController";
// import { auth } from "@/main";

// services
import UserService from "../services/userService";
import { useUserStore } from "@/store/userStore";

export default class UserController {
  private usersStore = useUsersStore();
  private userService = new UserService();
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
      const { name, user, password, email, password_confirmation } = params;

      await ssoApiConnector.post({
        url: `register`,
        data: { name, user, password, email, password_confirmation, client_id: "main-app" },
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async updateUserAccount(params: UpdateUserAccount): Promise<void> {
    try {
      const { id, name, user, email } = params;

      await apiConnector.post({
        url: `admin/update-user-account`,
        data: { id, name, user, email },
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
  }): Promise<{ token: string } | void> {
    try {
      const { user, password } = params;
      const serverResponse = await ssoApiConnector.post<{ token: string }>({
        url: `login`,
        data: { email: user, password, client_id: "main-app" },
      });
      const token = `Bearer ${serverResponse.token}`;

      return { token };
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "errorDetail" in e) {
        const customError = e as ICustomError;
        if (customError.errorDetail != "Unauthenticated.") throw customError;
      } else {
        throw e;
      }
    }
  }

  async loadUser() {
    try {
      const user = await this.userService.getUser();
      if (user) this.updateUserProps({ user });
    } catch (e: unknown) {
      const customError = this.errorController.getError({ error: e });
      
      const isAuthError = customError.errorDetail === "Unauthenticated.";
      const isNetworkError = 
        customError.message === "No response received from server" ||
        customError.message.includes("Network Error") ||
        !customError.status;

      if (import.meta.env.DEV && isNetworkError) {
        console.warn("[DEV] Backend no disponible - operando en modo offline");
      }

      if (!isAuthError && !isNetworkError) {
        throw customError;
      }
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
      await ssoApiConnector.post({ url: `recover-password`, data: { email } });
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
      await ssoApiConnector.post({
        url: `reset-password`,
        data: { email, code, password },
      });
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

  async refreshUserToken(params: { refreshToken: string }) {
    try {
      const { refreshToken } = params;
      await ssoApiConnector.post({
        url: `refresh-token`,
        data: { refreshToken },
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  storeUserToken(params: { token: string }) {
    const { token } = params;
    serverConfigController.setAuthTokens({ accessToken: token });
  }

  storeRefreshToken(params: { refreshToken: string }) {
    const { refreshToken } = params;
    Cookies.set("refresh-token", refreshToken, {
      secure: true,
      sameSite: "Strict",
    });
  }

  async resendEmailVerification(params: { email: string }) {
    const { email } = params;
    try {
      await ssoApiConnector.post({
        url: `resend-confirmation-email`,
        data: { email },
      });
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "errorDetail" in e) {
        const customError = e as ICustomError;
        if (customError.errorDetail != "Unauthenticated.") throw customError;
      } else {
        throw e;
      }
    }
  }
}
