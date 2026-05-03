import SSOServerConfig from "@/controllers/SSOServerConfigController";
import axios from "axios";

type ContentType = "application/json" | "multipart/form-data";

import ErrorController from "@/controllers/errorController";
import DpopService from "@/services/dpopService";

export default class SSOAPIController {
  private configService: SSOServerConfig;
  private baseUrl: string = "";
  private errorController = new ErrorController();
  private dpopService: DpopService | null = null;

  constructor(config: SSOServerConfig, dpopService?: DpopService) {
    this.configService = config;
    this.baseUrl = config.getConfig().baseUrl;
    this.dpopService = dpopService ?? null;
  }

  private stripBearerPrefix(token: string): string {
    return token.replace(/^Bearer\s+/i, "");
  }

  private getFullUrl(url: string): string {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return `${baseUrl}/${url}`;
  }

  private async getDpopHeader(method: string, url: string, accessToken?: string): Promise<string | undefined> {
    if (!this.dpopService || !accessToken) return undefined;
    try {
      const fullUrl = this.getFullUrl(url);
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
    const accessToken = this.configService.getConfig().accessToken;
    const cleanToken = this.stripBearerPrefix(accessToken);
    const dpopProof = await this.getDpopHeader("GET", url, cleanToken);
    try {
      const response = await axios.request<T>({
        url: this.getFullUrl(url),
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
    const accessToken = this.configService.getConfig().accessToken;
    const cleanToken = this.stripBearerPrefix(accessToken);
    const dpopProof = await this.getDpopHeader("POST", url, cleanToken);

    try {
      const response = await axios.request<T>({
        url: this.getFullUrl(url),
        method: "POST",
        headers: {
          "Content-Type": contentType,
          ...(accessToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
          ...(dpopProof ? { DPoP: dpopProof } : {}),
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
