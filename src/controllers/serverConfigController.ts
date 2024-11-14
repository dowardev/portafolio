// services
import {
  storeDataOnLocalStorage,
  getDataFromLocalStorage,
  storeCookie,
  getCookie,
  removeCookie,
} from "../services/system";

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
    if (serverUrl)
      await storeDataOnLocalStorage({ key: "serverUrl", value: serverUrl });
    if (userToken) {
      storeCookie({ key: "userToken", value: userToken });
    }
  }

  private async load(): Promise<void> {
    this.serverUrl = await getDataFromLocalStorage({ key: "serverUrl" });
    this.userToken = getCookie({ key: "userToken" });
  }

  public async getConfig(): Promise<{ serverUrl: string; UserToken: string }> {
    return { serverUrl: this.serverUrl, UserToken: this.userToken };
  }

  public clearData() {
    removeCookie({ key: "userToken" });
  }
}
