declare module '@tu-org/sso-client' {
  import type { AxiosRequestConfig } from 'axios';

  export type OpenUrlHandler = (params: { url: string }) => void | Promise<void>;

  export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_protected: boolean;
    pivot?: {
      sso_client_id: number | null;
    };
  }

  export interface User {
    id?: string;
    name?: string;
    user?: string;
    password?: string;
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
    rememberMe?: boolean;
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
    rememberMe?: boolean;
  }

  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
  }

  export interface ICustomError {
    status?: number;
    errorDetail?: string;
    cause?: Error;
  }

  export interface SSOConfig {
    ssoUrl: string;
    ssoFrontendUrl: string;
    apiBaseUrl: string;
    clientId: string;
    onAuthSuccess?: (user: User) => void;
    onAuthError?: (error: ICustomError) => void;
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
    loginRedirect?: boolean;
    redirectUri?: string;
  }

  export interface RouteLike {
    name?: string | symbol | null;
    path: string;
  }

  export interface NavigationGuardNext {
    (path?: string | { path: string }): void;
  }

  export interface SSOClientLike {
    readonly isAuthenticated: boolean;
    loginWithRedirect(options?: { redirectUri?: string; screenHint?: 'login' | 'register'; openUrl?: OpenUrlHandler }): Promise<void>;
  }

  export function createAuthGuard(
    ssoClient: SSOClientLike,
    options?: AuthGuardOptions
  ): (to: RouteLike, from: RouteLike, next: NavigationGuardNext) => Promise<void>;

  export class SSOClient {
    constructor(config: SSOConfig);
    init(): Promise<void>;

    readonly http: HttpClient;

    login(params: LoginParams): Promise<AuthResponse>;
    loginWithRedirect(options?: { redirectUri?: string; screenHint?: 'login' | 'register'; openUrl?: OpenUrlHandler }): Promise<void>;
    handleCallback(url: string, options?: { redirectUri?: string }): Promise<{ user: User }>;
    register(params: RegisterParams): Promise<void>;
    logout(options?: { redirectUri?: string; openUrl?: OpenUrlHandler }): Promise<void>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    recoverPassword(params: { email: string }): Promise<void>;
    resetPassword(params: { email: string; code: number | string; password: string }): Promise<void>;
    resendEmailVerification(email: string): Promise<void>;

    readonly isAuthenticated: boolean;
    getUser(): Promise<User | null>;
    checkSession(): Promise<{ authenticated: boolean; user?: User }>;

    onAuthStateChange(callback: (state: AuthState) => void): () => void;
  }
}
