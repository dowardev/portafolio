import { UserToken } from "./interfaces";
import { url } from "@vuelidate/validators";
import axios from "axios";

export default class APIService {
  private serverUrl: string = "";
  private url: string = "";
  private userToken: string = "";

  constructor(params: { serverUrl: string; userToken: string }) {
    this.serverUrl = params.serverUrl;
    this.userToken = params.userToken;
  }

  public async get(params: { url: string; data?: any }): Promise<any> {
    const { url, data = {} } = params;

    const response = await axios.request({
      url: this.serverUrl + url,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.userToken}`,
      },
      data,
    });
    return await response.data;
  }

  public async post(params: { url: string; data?: any }): Promise<any> {
    const { url, data = {} } = params;

    const response = await axios.request({
      url: this.serverUrl + url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.userToken}`,
      },
      params: data,
    });

    return await response;
  }
}
