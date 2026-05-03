import Cookies from "js-cookie";

export default class ServerConfig {
  private baseUrl: string = "";
  private accessToken: string = "";
  private tokenType: string = "Bearer";

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

  setAuthTokens(params: { accessToken: string; tokenType?: string }) {
    const { accessToken, tokenType } = params;
    if (accessToken) {
      this.accessToken = accessToken;
      this.tokenType = tokenType ?? "Bearer";
      
      Cookies.set("user-token", accessToken, {
        secure: false,
        sameSite: "Lax",
        path: "/",
      });
      
      localStorage.setItem("user-token", accessToken);
    }
  }

  public getConfig(): {
    baseUrl: string;
    accessToken: string;
    tokenType: string;
  } {
    return {
      baseUrl: this.baseUrl,
      accessToken: this.accessToken,
      tokenType: this.tokenType,
    };
  }

  clearData() {
    Cookies.remove("user-token");
    this.baseUrl = "";
    this.accessToken = "";
    this.tokenType = "Bearer";
  }
}
