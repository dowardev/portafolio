import ServerConfig from "@/controllers/serverConfigController";
import axios from "axios";

type ContentType = "application/json" | "multipart/form-data";
type RetryCallback<T> = () => Promise<T>;

// controllers
import ErrorController from "@/controllers/errorController";

export default class APIService {
  private configService: ServerConfig;
  private baseUrl: string = "";
  private accessToken: string = "";
  private refreshTokenEndPoint: string = "";
  private refresToken: string = "";
  private errorController = new ErrorController();

  constructor(config: ServerConfig) {
    this.configService = config;
    this.baseUrl = config.getConfig().baseUrl;
    this.accessToken = config.getConfig().accessToken;
    this.refreshTokenEndPoint = config.getConfig().refreshTokenEndPoint;
    this.refresToken = config.getConfig().refreshToken;
  }

  public async get<T, P = Record<string, unknown>>(params: {
    url: string;
    data?: P;
  }): Promise<T | void> {
    const { url, data = {} } = params;
    try {
      const response = await axios.request<T>({
        url: this.baseUrl + url,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `${this.accessToken}`,
        },
        params: data,
      });
      return response.data;
    } catch (e) {
      const error = this.errorController.getError({ error: e });
      if (error.errorDetail == "Token expired.") {
        return this.handleTokenRefresh(() => this.get(params));
      } else {
        throw error;
      }
    }
  }

  public async post<T>(params: {
    url: string;
    data?: object;
    contentType?: ContentType;
  }): Promise<T> {
    const { url, data = {}, contentType = "application/json" } = params;

    try {
      const response = await axios.request<T>({
        url: this.baseUrl + url,
        method: "POST",
        headers: {
          "Content-Type": contentType,
          Authorization: `${this.accessToken}`,
        },
        data,
      });

      return response.data;
    } catch (e) {
      const error = this.errorController.getError({ error: e });
      if (error.errorDetail == "Token expired.") {
        return this.handleTokenRefresh(() => this.post(params));
      } else {
        throw error;
      }
    }
  }

  public async refreshAccessToken() {
    try {
      const response = await axios.request({
        url: this.baseUrl + this.refreshTokenEndPoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this.accessToken}`,
        },
        data: { refresh_token: this.refresToken },
      });

      // Update the tokens
      this.accessToken = `Bearer ${response.data.access_token}`;
      if (response.data.refresh_token) {
        this.refresToken = response.data.refresh_token;
      }
      this.configService.setAuthTokens({
        accessToken: `Bearer ${this.accessToken}`,
        refreshToken: this.refresToken,
      });

      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }

  private async handleTokenRefresh<T>(
    retryCallback: RetryCallback<T>,
  ): Promise<T> {
    try {
      await this.refreshAccessToken();
      return retryCallback();
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      throw refreshError;
    }
  }
}
