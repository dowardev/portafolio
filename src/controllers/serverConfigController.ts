// services
import SystemService from "../services/system";

export default class ServerConfig {
  private serverUrl: string = "";
  private userToken: string = "";
  private systemService = new SystemService();

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
    if (serverUrl)
      await this.systemService.storeDataOnLocalStorage({
        key: "serverUrl",
        value: serverUrl,
      });
    if (userToken) {
      this.systemService.storeCookie({ key: "userToken", value: userToken });
    }
  }

  private async load(): Promise<void> {
    this.serverUrl = await this.systemService.getDataFromLocalStorage({
      key: "serverUrl",
    });
    this.userToken = this.systemService.getCookie({ key: "userToken" });
  }

  public async getConfig(): Promise<{ serverUrl: string; UserToken: string }> {
    return { serverUrl: this.serverUrl, UserToken: this.userToken };
  }

  public clearData() {
    this.systemService.removeCookie({ key: "userToken" });
  }
}
