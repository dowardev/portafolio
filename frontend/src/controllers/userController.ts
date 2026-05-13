import SystemService from "@/services/systemService";
import { storeToRefs } from "pinia";
import {
  ICustomError,
  User,
} from "../utils/interfaces";
import { getSSOClient } from "@/ssoClientAccessor";
import { getApiConnector } from "@/apiConnector";

import ErrorController from "./errorController";

import { useUserStore } from "@/store/userStore";

interface MyPermissionsResponse {
  roles: string[];
  permissions: Record<string, boolean>;
}

export default class UserController {
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
      const ssoUser = await getSSOClient().getUser();
      if (ssoUser) this.updateUserProps({ user: ssoUser });
      if (!this.userStore.permissionsLoaded) {
        await this.loadPermissions();
      }
    } catch (e: unknown) {
      const customError = this.errorController.getError({ error: e });
      
      const isAuthError = 
        customError.errorDetail === "Unauthenticated." || 
        customError.errorDetail === "Token no proporcionado";
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
        if (customError.errorDetail != "Unauthenticated." && customError.errorDetail != "Token no proporcionado") throw customError;
      } else {
        throw e;
      }
    }
  }

  async logout() {
    await getSSOClient().logout();
    this.userStore.logout();
  }

  async loadPermissions(): Promise<void> {
    try {
      const response = await getApiConnector().get<MyPermissionsResponse>('my-permissions');
      this.userStore.setPermissions({ roles: response.roles, permissions: response.permissions });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  hasPermission(params: { slug: string }): boolean {
    return this.userStore.hasPermission(params);
  }

  hasAnyPermission(params: { slugs: string[] }): boolean {
    return this.userStore.hasAnyPermission(params);
  }

  hasRole(params: { slug: string }): boolean {
    return this.userStore.hasRole(params);
  }

  hasAnyRole(params: { slugs: string[] }): boolean {
    return this.userStore.hasAnyRole(params);
  }

  isAdmin(): boolean {
    return this.userStore.isAdmin;
  }

  can(params: { role?: string; permission?: string }): boolean {
    return this.userStore.can(params);
  }

  get permissionsStore() {
    return this.userStore;
  }
}
