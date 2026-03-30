import SystemService from "@/services/systemService";
import { storeToRefs } from "pinia";
import {
  ICustomError,
  User,
} from "../utils/interfaces";
import Cookies from "js-cookie";
import { ssoApiConnector, serverConfigController } from "@/main";

import ErrorController from "./errorController";

import UserService from "../services/userService";
import { useUserStore } from "@/store/userStore";

export default class UserController {
  private userService = new UserService();
  private systemService = new SystemService();
  private errorController = new ErrorController();
  private userStore = useUserStore();
  private userRefs = storeToRefs(this.userStore);

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

  async createUserAccount(params: {
    name: string;
    user: string;
    password: string;
    email: string;
  }): Promise<void> {
    try {
      const { name, user, password, email } = params;

      await ssoApiConnector.post({
        url: `register`,
        data: { name, user, password, email, client_id: "main-app" },
      });
    } catch (error) {
      return this.errorController.handleError({ error });
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
