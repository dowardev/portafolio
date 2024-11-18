// services
import SystemService from "../services/systemService";

export default class ServerConfig {
  private serverUrl: string = "";
  private userToken: string = "";
  private systemService = new SystemService();

  public async storeUserToken(params: {
    serverUrl?: string;
    userToken?: string;
  }): Promise<void> {
    const { serverUrl, userToken } = params;
    if (serverUrl) {
      await this.systemService.storeDataOnLocalStorage({
        key: "serverUrl",
        value: serverUrl,
      });
    }
    if (userToken) {
      this.systemService.storeCookie({ key: "userToken", value: userToken });
    }
  }

  async load(): Promise<void> {
    this.serverUrl = await this.systemService.getDataFromLocalStorage({
      key: "serverUrl",
    });
    this.userToken = this.systemService.getCookie({ key: "userToken" });
  }

  public async getConfig(): Promise<{ serverUrl: string; userToken: string }> {
    return { serverUrl: this.serverUrl, userToken: this.userToken };
  }

  public clearData() {
    this.systemService.removeCookie({ key: "userToken" });
  }
}
