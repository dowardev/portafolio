declare module '@tu-org/sso-client' {
  import type { AxiosRequestConfig } from 'axios';
  import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

  export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_protected: boolean;
  }

  export interface User {
    id?: string;
    name?: string;
    user?: string;
    email?: string;
    roles?: Role[];
    isEmailVerified?: boolean;
    isDisabled?: boolean;
    imageProfile?: string;
  }

  export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user?: User;
  }

  export interface RegisterParams {
    name: string;
    user: string;
    email: string;
    password: string;
    password_confirmation: string;
  }

  export interface LoginParams {
    email: string;
    password: string;
  }

  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
  }

  export interface SSOConfig {
    ssoUrl: string;
    ssoFrontendUrl: string;
    apiBaseUrl: string;
    clientId: string;
  }

  export class HttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  }

  export interface AuthGuardOptions {
    publicRoutes?: string[];
    loginRedirect?: string;
    redirectUri?: string;
  }

  export function createAuthGuard(
    ssoClient: SSOClient,
    options?: AuthGuardOptions
  ): (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => Promise<void>;

  export class SSOClient {
    constructor(config: SSOConfig);
    init(): Promise<void>;

    readonly http: HttpClient;

    login(params: LoginParams): Promise<AuthResponse>;
    loginWithRedirect(options?: { redirectUri?: string; screenHint?: 'login' | 'register' }): Promise<void>;
    handleCallback(url: string): Promise<{ user: User }>;
    register(params: RegisterParams): Promise<void>;
    logout(): Promise<void>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    recoverPassword(params: { email: string }): Promise<void>;
    resetPassword(params: { email: string; code: number | string; password: string }): Promise<void>;
    resendEmailVerification(email: string): Promise<void>;

    readonly isAuthenticated: boolean;
    getUser(): Promise<User | null>;

    onAuthStateChange(callback: (state: AuthState) => void): () => void;
  }
}
