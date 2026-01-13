// controllers

// services
import Cookies from "js-cookie";
import SystemService from "../services/systemService";

export default class ServerConfig {
  private baseUrl: string = "";
  private accessToken: string = "";
  private refreshToken: string = "";
  private refreshTokenEndPoint: string = "";

  constructor(params: {
    baseUrl: string;
    accessToken?: string;
    refreshToken?: string;
    refreshTokenEndPoint?: string;
  }) {
    if (!params) return;
    this.baseUrl = params.baseUrl ?? "";
    this.accessToken = params.accessToken ?? "";
    this.refreshToken = params.refreshToken ?? "";
    this.refreshTokenEndPoint = params.refreshTokenEndPoint ?? "";
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthTokens(params: { accessToken: string; refreshToken: string }) {
    const { accessToken: accessTOken, refreshToken } = params;
    if (accessTOken) {
      this.accessToken = accessTOken;
      Cookies.set("access-token", accessTOken, {
        secure: true,
        sameSite: "Strict",
      });
    }

    if (refreshToken) {
      this.refreshToken = refreshToken;
      Cookies.set("refresh-token", refreshToken, {
        secure: true,
        sameSite: "Strict",
      });
    }
  }

  setRefreshTokensEndPoint(params: { refreshTokenEndPoint: string }) {
    this.refreshTokenEndPoint = params.refreshTokenEndPoint;
  }

  public getConfig(): {
    baseUrl: string;
    accessToken: string;
    refreshToken: string;
    refreshTokenEndPoint: string;
  } {
    return {
      baseUrl: this.baseUrl,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      refreshTokenEndPoint: this.refreshTokenEndPoint,
    };
  }
}
