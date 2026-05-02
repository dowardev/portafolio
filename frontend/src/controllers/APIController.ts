import ServerConfig from "@/controllers/serverConfigController";
import axios from "axios";
import Cookies from "js-cookie";
import ErrorController from "@/controllers/errorController";
import DpopService from "@/services/dpopService";

type ContentType = "application/json" | "multipart/form-data";

export default class APIController {
  private configService: ServerConfig;
  private baseUrl: string = "";
  private errorController = new ErrorController();
  private dpopService: DpopService | null = null;

  constructor(config: ServerConfig, dpopService?: DpopService) {
    this.configService = config;
    this.baseUrl = config.getConfig().baseUrl;
    this.dpopService = dpopService ?? null;
  }

  private getAccessToken(): string {
    return Cookies.get("user-token") || "";
  }

  private stripBearerPrefix(token: string): string {
    return token.replace(/^Bearer\s+/i, "");
  }

  private async getDpopHeader(method: string, url: string, accessToken?: string): Promise<string | undefined> {
    if (!this.dpopService) return undefined;
    try {
      const fullUrl = this.baseUrl + url;
      return await this.dpopService.createDpopProof(method.toUpperCase(), fullUrl, accessToken);
    } catch {
      return undefined;
    }
  }

  public async get<T, P = Record<string, unknown>>(params: {
    url: string;
    data?: P;
  }): Promise<T> {
    const { url, data = {} } = params;
    const accessToken = this.getAccessToken();
    const cleanToken = this.stripBearerPrefix(accessToken);
    const dpopProof = accessToken ? await this.getDpopHeader("GET", url, cleanToken) : undefined;
    try {
      const response = await axios.request<T>({
        url: this.baseUrl + url,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(accessToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
          ...(dpopProof ? { DPoP: dpopProof } : {}),
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
    const accessToken = this.getAccessToken();
    const cleanToken = this.stripBearerPrefix(accessToken);
    const dpopProof = accessToken ? await this.getDpopHeader("POST", url, cleanToken) : undefined;

    const headers: Record<string, string> = {
      ...(accessToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      ...(dpopProof ? { DPoP: dpopProof } : {}),
    };

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

  public async delete<T>(params: {
    url: string;
  }): Promise<T> {
    const { url } = params;
    const accessToken = this.getAccessToken();
    const cleanToken = this.stripBearerPrefix(accessToken);
    const dpopProof = accessToken ? await this.getDpopHeader("DELETE", url, cleanToken) : undefined;

    const headers: Record<string, string> = {
      ...(accessToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      ...(dpopProof ? { DPoP: dpopProof } : {}),
    };

    const response = await axios.request<T>({
      url: this.baseUrl + url,
      method: "DELETE",
      headers,
    });

    return response.data;
  }
}