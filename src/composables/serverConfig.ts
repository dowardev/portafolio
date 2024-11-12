import { path } from "path";
import { storageInstance } from "@/main";
import Cookies from "js-cookie";

export default class ServerConfig {
  private serverUrl: string = "";
  private userToken: string = "";

  public static async createInstance(): Promise<ServerConfig> {
    const instance = new ServerConfig();
    await instance.load();
    return instance;
  }

  public async store(params: {
    serverUrl?: string;
    userToken?: string;
  }): Promise<void> {
    const { serverUrl, userToken } = params;
    if (serverUrl) await storageInstance.set("serverUrl", serverUrl);
    if (userToken) {
      Cookies.set("userToken", userToken, {
        secure: true,
        sameSite: "Strict",
        domain: window.location.origin,
        path: "/",
      });
    }
  }

  private async load(): Promise<void> {
    this.serverUrl = await storageInstance.get("serverUrl");
    this.userToken = Cookies.get("userToken");
  }

  public async getConfig(): Promise<{ serverUrl: string; UserToken: string }> {
    return { serverUrl: this.serverUrl, UserToken: this.userToken };
  }

  public clearData() {
    Cookies.remove("userToken");
  }
}
