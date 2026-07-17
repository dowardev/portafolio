import SystemService from "@/services/systemService";
import { storeToRefs } from "pinia";
import {
  ICustomError,
  MyPermissionsResponse,
  User,
} from "../utils/interfaces";
import { getSSOClient } from "@/ssoClientAccessor";
import { getApiConnector } from "@/apiConnector";

import ErrorController from "./errorController";

import { useUserStore } from "@/store/userStore";

type IdentityStatus = 'loaded' | 'unauthenticated';
interface IdentityResult {
  status: IdentityStatus;
  user?: User;
  roles?: string[];
  permissions?: Record<string, boolean>;
}

let _identityPromise: Promise<IdentityResult> | null = null;

async function loadIdentitySafely(): Promise<IdentityResult> {
  if (_identityPromise) return _identityPromise;

  _identityPromise = (async (): Promise<IdentityResult> => {
    const ssoClient = getSSOClient();

    if (!ssoClient.isAuthenticated) {
      return { status: 'unauthenticated' };
    }

    let user: User | null = null;
    try {
      user = await ssoClient.getUser();
    } catch {
      return { status: 'unauthenticated' };
    }

    if (!user) {
      return { status: 'unauthenticated' };
    }

    try {
      const response = await getApiConnector().get<MyPermissionsResponse>(
        'my-permissions',
      );

      if (!ssoClient.isAuthenticated) {
        return { status: 'unauthenticated' };
      }

      return {
        status: 'loaded',
        user,
        roles: response.roles,
        permissions: response.permissions,
      };
    } catch (error) {
      const errCtrl = new ErrorController();
      const ce = errCtrl.getError({ error });
      const isAuthError =
        ce.status === 401 ||
        ce.errorDetail === 'Unauthenticated.' ||
        ce.errorDetail === 'Token no proporcionado';
      if (isAuthError) {
        return { status: 'unauthenticated' };
      }
      throw error;
    }
  })();

  try {
    return await _identityPromise;
  } finally {
    _identityPromise = null;
  }
}

export default class UserController {
  private systemService = new SystemService();
  private errorController = new ErrorController();
  private userStore = useUserStore();
  private userRefs = storeToRefs(this.userStore);

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<{ id: string; path: string; name: string }> {
    const { image, type } = params;
    try {
      const { id, url, name } = await this.systemService.uploadImage({
        image,
        type,
      });
      return { id: id ?? "", path: url ?? "", name: name ?? "" };
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
    this.userStore.setLoadState('loading');

    try {
      const identity = await loadIdentitySafely();

      if (identity.status === 'unauthenticated') {
        this.userStore.setLoadState('unauthenticated');
        return;
      }

      if (identity.user) {
        this.updateUserProps({ user: identity.user });
      }
      this.userStore.updateUserLoggedProp(true);
      this.userStore.setPermissions({
        roles: identity.roles ?? [],
        permissions: identity.permissions ?? {},
      });
      this.userStore.setLoadState('loaded');
    } catch (error) {
      this.userStore.setLoadState('idle');
      const ce = this.errorController.getError({ error });
      const isNetworkError =
        ce.message === 'No response received from server' ||
        ce.message.includes('Network Error') ||
        !ce.status;
      if (isNetworkError && import.meta.env.DEV) {
        console.warn('[DEV] Backend no disponible - operando en modo offline');
        return;
      }
      throw ce;
    }
  }

  async refreshIdentity(): Promise<void> {
    _identityPromise = null;
    this.userStore.setLoadState('idle');
    await this.loadUser();
  }

  updateUserProps(params: { user: User }) {
    try {
      const { user } = params;
      this.userStore.updateUserProps(user);
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getUser(): User | undefined {
    try {
      return this.userRefs.user.value ?? undefined;
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getCurrentUserId(): string | undefined {
    return this.userRefs.user.value?.id;
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
      if (typeof e === 'object' && e !== null && 'errorDetail' in e) {
        const customError = e as ICustomError;
        if (
          customError.errorDetail != 'Unauthenticated.' &&
          customError.errorDetail != 'Token no proporcionado'
        )
          throw customError;
      } else {
        throw e;
      }
    }
  }

  async logout() {
    _identityPromise = null;
    await getSSOClient().logout();
    this.userStore.logout();
  }

  async loadPermissions(): Promise<void> {
    try {
      const response = await getApiConnector().get<MyPermissionsResponse>(
        'my-permissions',
      );
      this.userStore.setPermissions({
        roles: response.roles,
        permissions: response.permissions,
      });
    } catch (error) {
      const ce = this.errorController.getError({ error });
      const isAuthError =
        ce.status === 401 ||
        ce.errorDetail === 'Unauthenticated.' ||
        ce.errorDetail === 'Token no proporcionado';
      if (isAuthError) {
        this.userStore.clearPermissions();
        return;
      }
      console.error('[loadPermissions] Error loading permissions:', error);
      return this.errorController.handleError({ error });
    }
  }

  async refreshPermissions(): Promise<void> {
    this.userStore.clearPermissions();
    await this.loadPermissions();
  }

  get isAdmin(): boolean {
    return this.userStore.isAdmin;
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

  can(params: { role?: string; permission?: string }): boolean {
    return this.userStore.can(params);
  }

  get permissionsStore() {
    return this.userStore;
  }
}
