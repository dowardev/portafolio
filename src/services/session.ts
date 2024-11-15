import {
  UserRegister,
  EmailResetPassword,
  ResetPassword,
  UpdateUserPassword,
} from "./interfaces";
import { apiConnector } from "@/main";

import apolloClient from "../Apollo";
import axios from "axios";
import { getUserToken } from "./user";

export default class SessionService {
  async userRegister(params: UserRegister): Promise<void> {
    const { name, user, password, email } = params;

    await apiConnector.post({
      url: `signup`,
      data: { name, user, password, email },
    });
  }

  async userLogin(params: {
    user: string;
    password: string;
  }): Promise<{ token: string }> {
    const { user, password } = params;

    try {
      const response = await apiConnector.post({
        url: `login`,
        data: { email: user, password },
      });

      return { token: `Bearer ${response.data.access_token}` };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await apiConnector.post({ url: `logout` });
  }

  async recoverPassword(params: { email: string }) {
    const { email } = params;

    try {
      await apiConnector.post({ url: `recover-password`, data: { email } });
    } catch (error: any) {
      console.error(error);
      if (error.response.data == "Email not found")
        throw new Error("Email not found");
      else throw error;
    }
  }

  async sendNewPassword(params: {
    email: string;
    code: string;
    password: string;
  }) {
    const { code, password, email } = params;

    try {
      await apiConnector.post({
        url: `reset-password`,
        data: { email, code, password },
      });
    } catch (error: any) {
      if (error.response.data == "Code invalid")
        throw new Error("Code invalid");
      if (error.response.data.password)
        throw new Error("The password does not meet the minimum requirements");
      else throw error;
    }
  }

  async updateUserPassword(params: UpdateUserPassword): Promise<void> {
    // TODO: pending
    // const response = await axios.request({
    //   url: `http://127.0.0.1:8000/api/upload-image`,
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: getUserToken(),
    //   },
    //   params: {
    //     image,
    //   },
    // });
  }
}
