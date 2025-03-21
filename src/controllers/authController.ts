import APIService from "@/services/APIService";
import { User, UserServerResponse } from "@/services/interfaces";
import ErrorController from "./errorController";

export default class AuthController {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private serverUrl: string = "http://localhost:8000";
  private errorController = new ErrorController();
  private apiManager: APIService;

  constructor(
    accessToken: string,
    refreshToken: string,
    serverUrl: string,
    apiManager: APIService,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.serverUrl = serverUrl;
    this.apiManager = apiManager;
  }

  async get(): Promise<User | void> {
    let typeError = "";

    try {
      const response = (await this.apiManager.get({
        url: `user-auth`,
      })) as UserServerResponse;
      return this.formatUserResponse({ response });
    } catch (error) {
      if (this.errorController.getError({ error }).message == "Token expired.")
        typeError = "refreshAccessToken";
    }

    if (typeError == "refreshAccessToken") {
      await this.getNewAccessToken();
      const response = (await this.apiManager.get({
        url: `user-auth`,
      })) as UserServerResponse;
      return this.formatUserResponse({ response });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatUserResponse(params: { response: any }): User {
    const { response } = params;

    return {
      id: response.id.toString(),
      name: response.name,
      user: response.user,
      email: response.email,
      isAdmin: response.is_admin,
      isEmailVerified: response.is_email_verified,
      isDisabled: response.is_user_disabled,
      imageProfile: response.image_profile,
    };
  }

  private async getNewAccessToken(): Promise<void> {
    const response = await this.apiManager.post({
      url: `refresh-token`,
      data: { refresh_token: this.refreshToken },
    });
    this.accessToken = response.data.access_token;
  }
}
