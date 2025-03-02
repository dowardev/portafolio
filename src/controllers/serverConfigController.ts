// controllers
import ErrorController from "./errorController";

// services
import SystemService from "../services/systemService";

export default class ServerConfig {
  private serverUrl: string = "";
  private userToken: string = "";
  private systemService = new SystemService();
  private errorController = new ErrorController();

  public async storeUserToken(params: {
    serverUrl?: string;
    userToken?: string;
  }): Promise<void> {
    try {
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
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async load(): Promise<void> {
    this.serverUrl = await this.systemService.getDataFromLocalStorage({
      key: "serverUrl",
    });
    try {
      const token = this.systemService.getCookie({ key: "userToken" });
      if (!token) {
        return;
      }
      this.userToken = token;
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  public async getConfig(): Promise<{
    serverUrl: string;
    userToken: string;
  } | void> {
    try {
      return { serverUrl: this.serverUrl, userToken: this.userToken };
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  public clearData() {
    try {
      this.systemService.removeCookie({ key: "userToken" });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }
}
