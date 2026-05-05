import SystemService from "@/services/systemService";
import { storeToRefs } from "pinia";
import {
  ICustomError,
  User,
} from "../utils/interfaces";
import { getSSOClient } from "@/ssoClientAccessor";

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

  async createUserAccount(params: {
    name: string;
    user: string;
    password: string;
    email: string;
    password_confirmation: string;
  }): Promise<void> {
    try {
      const { name, user, password, email, password_confirmation } = params;
      await getSSOClient().register({
        name,
        user,
        password,
        email,
        password_confirmation,
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
    try {
      await getSSOClient().recoverPassword(params);
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async sendNewPassword(params: {
    email: string;
    code: number;
    password: string;
  }) {
    try {
      await getSSOClient().resetPassword(params);
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async resendEmailVerification(params: { email: string }) {
    try {
      await getSSOClient().resendEmailVerification(params.email);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "errorDetail" in e) {
        const customError = e as ICustomError;
        if (customError.errorDetail != "Unauthenticated.") throw customError;
      } else {
        throw e;
      }
    }
  }

  async logout() {
    await getSSOClient().logout();
    this.userStore.logout();
  }
}
