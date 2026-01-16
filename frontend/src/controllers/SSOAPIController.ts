import SSOServerConfig from "@/controllers/SSOServerConfigController";
import axios from "axios";

type ContentType = "application/json" | "multipart/form-data";

import ErrorController from "@/controllers/errorController";

export default class SSOAPIController {
  private configService: SSOServerConfig;
  private baseUrl: string = "";
  private accessToken: string = "";
  private errorController = new ErrorController();

  constructor(config: SSOServerConfig) {
    this.configService = config;
    this.baseUrl = config.getConfig().baseUrl;
    this.accessToken = config.getConfig().accessToken;
  }

  public async get<T, P = Record<string, unknown>>(params: {
    url: string;
    data?: P;
  }): Promise<T> {
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
      throw error;
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
      throw error;
    }
  }
}
