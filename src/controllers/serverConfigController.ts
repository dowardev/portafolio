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
    try {
      // const token = this.systemService.getCookie({ key: "userToken" });
      const token =
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDYyMjRhYi1iYjgwLTQ4NGMtYjM5Yy1kMWU5MTc4YzNkNmEiLCJqdGkiOiJjZDAxMDYyYTJhZDk3YTNhYTk3MTk4ZTIxNDBmMjU1ZmM3ZjIxNzUzMTFhOWFmMWJhNDY2ODc5OGJkMmIxNWFmYWI3ZmJlMTZiYjdmOWJmYSIsImlhdCI6MTczNzIzMDA3MC4wNzA5OTUsIm5iZiI6MTczNzIzMDA3MC4wNzEwMTMsImV4cCI6MTc2ODc2NjA3MC4wNjMyNDEsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.IWRRX8lLMkz7XivSSt2etO_t-sUWvcfS9FJGwXDLD4DZsHNEdsi2qI_yVB5DqBqhysQuh9Ywx3sMj0p9DqvXT-AwBI5LJ2iv5whGpPjKiKv7Rsqz_i6ktHwbxpnG2Yn0p7xFraRbHohUJFdPXTi4r6uq3i5JETcKn6P9OhuX8B6TD3fmF_IXLDm9ThZyC3FkBmFOI3OXCSyr5X_DBOAuCjhRJy5Md86u_nRcCU1sgWyyFNtirSiauDGAj90qmnRumCkZGn7wGNj8LajZPjx2I6bJWOpmMay63FJtc1kqy1FI9PCLXIzzJbf8begSqzOgyoNyhWVGrOVUlDDUI0HwfK57LZEOT8XsxrhDi9cX5CfIzwhKnb6QqM1T-fhbgScgBvyUN1XUvyIGsi0fCSpr73FmKYZvHRy2w0w1WsX4q5Ism5CuBXobZZMpf0Blhd62Uqsrn2a8Xkrq_6yORP49BP106lCUyuxNif3EzKL8vXrb18DC3O5Os2egj0yQrsGzCBiUI2sb7WkYbZbUhc23vjIN6OYH56DQ8Z5sA_8U6OZ2TwsG6-QrSe8uCmZvQYtdD9VM3UwGq4hpCy0yvW4U5hOz7UMoQHYZzaSoUvyQCmTfqXlQw-3PLkzyK_959u4T3omIMiCHaFBN1SHnUG4jcwz5wVHK_LFefOeRAnJizOo";
      if (!token) {
        return;
      }
      this.userToken = token;
    } catch (error: any) {
      throw error;
    }
  }

  public async getConfig(): Promise<{ serverUrl: string; userToken: string }> {
    return { serverUrl: this.serverUrl, userToken: this.userToken };
  }

  public clearData() {
    this.systemService.removeCookie({ key: "userToken" });
  }
}
