// controllers

// services
import Cookies from "js-cookie";
import SystemService from "../services/systemService";

export default class ServerConfig {
  private baseUrl: string = "";
  private accessToken: string = "";

  constructor(params: {
    baseUrl: string;
    accessToken?: string;
  }) {
    if (!params) return;
    this.baseUrl = params.baseUrl ?? "";
    this.accessToken = params.accessToken ?? "";
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthTokens(params: { accessToken: string }) {
    const { accessToken } = params;
    if (accessToken) {
      this.accessToken = accessToken;
      Cookies.set("user-token", accessToken, {
        secure: true,
        sameSite: "Strict",
      });
    }
  }

  public getConfig(): {
    baseUrl: string;
    accessToken: string;
  } {
    return {
      baseUrl: this.baseUrl,
      accessToken: this.accessToken,
    };
  }
}
