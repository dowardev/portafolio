import { UserToken } from "./interfaces";
import { url } from "@vuelidate/validators";
import axios from "axios";

type ContentType = "application/json" | "multipart/form-data";

export default class APIService {
  private serverUrl: string = "";
  private url: string = "";
  private userToken: string = "";

  constructor(params: { serverUrl: string; userToken: string }) {
    this.serverUrl = params.serverUrl;
    this.userToken = params.userToken;
  }

  public async get(params: {
    url: string;
    data?: Record<string, any>;
  }): Promise<any> {
    const { url, data = {} } = params;

    const response = await axios.request({
      url: this.serverUrl + url,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `${this.userToken}`,
      },
      params: data,
    });
    return await response.data;
  }

  public async post(params: {
    url: string;
    data?: any;
    contentType?: ContentType;
  }): Promise<any> {
    const { url, data = {}, contentType = "application/json" } = params;

    const response = await axios.request({
      url: this.serverUrl + url,
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `${this.userToken}`,
      },
      data,
    });

    return await response;
  }
}
