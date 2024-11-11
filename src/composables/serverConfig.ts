import { storageInstance } from "@/main";

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
    if (userToken) await storageInstance.set("userToken", userToken);
  }

  private async load(): Promise<void> {
    this.serverUrl = await storageInstance.get("serverUrl");
    this.userToken = await storageInstance.get("userToken");
  }

  public async getConfig(): Promise<{ serverUrl: string; UserToken: string }> {
    return { serverUrl: this.serverUrl, UserToken: this.userToken };
  }
}
