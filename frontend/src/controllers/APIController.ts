import ServerConfig from "@/controllers/serverConfigController";
import axios from "axios";

type ContentType = "application/json" | "multipart/form-data";

// controllers
import ErrorController from "@/controllers/errorController";

export default class APIController {
  private configService: ServerConfig;
  private baseUrl: string = "";
  private errorController = new ErrorController();

  constructor(config: ServerConfig) {
    this.configService = config;
    this.baseUrl = config.getConfig().baseUrl;
  }

  public async get<T, P = Record<string, unknown>>(params: {
    url: string;
    data?: P;
  }): Promise<T> {
    const { url, data = {} } = params;
    const accessToken = this.configService.getConfig().accessToken;
    try {
      const response = await axios.request<T>({
        url: this.baseUrl + url,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(accessToken ? { Authorization: accessToken } : {}),
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
    const accessToken = this.configService.getConfig().accessToken;

    const headers: Record<string, string> = {
      ...(accessToken ? { Authorization: accessToken } : {}),
    };

    // Solo establecer Content-Type si no es FormData
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = contentType;
    }

    const response = await axios.request<T>({
      url: this.baseUrl + url,
      method: "POST",
      headers,
      data,
    });

    return response.data;
  }
}
