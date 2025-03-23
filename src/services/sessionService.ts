import { AxiosError } from "axios";
import {
  UserRegister,
  UpdateUserPassword,
  SignUpUserServerResponse,
  SignUpUserResponse,
  UpdateUserAccount,
} from "../utils/interfaces";
import { apiConnector } from "@/main";

export default class SessionService {
  async userRegister(params: UserRegister): Promise<void> {
    const { name, user, password, email } = params;

    await apiConnector.post({
      url: `signup`,
      data: { name, user, password, email },
    });
  }

  async updateUserAccount(params: UpdateUserAccount): Promise<void> {
    const { id, name, user, email } = params;

    await apiConnector.post({
      url: `admin/update-user-account`,
      data: { id, name, user, email },
    });
  }

  async userLogin(params: {
    user: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string }> {
    const { user, password } = params;

    const response = await apiConnector.post({
      url: `login`,
      data: { email: user, password },
    });

    return {
      token: `Bearer ${response.data.access_token}`,
      refreshToken: response.data.refresh_token,
    };
  }

  async logout(): Promise<void> {
    await apiConnector.post({ url: `logout` });
  }

  async recoverPassword(params: { email: string }) {
    const { email } = params;
    await apiConnector.post({ url: `recover-password`, data: { email } });
  }

  async sendNewPassword(params: {
    email: string;
    code: number;
    password: string;
  }) {
    const { code, password, email } = params;

    await apiConnector.post({
      url: `reset-password`,
      data: { email, code, password },
    });
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

  async refreshAuthToken(params: { refreshToken: string }): Promise<void> {
    const { refreshToken } = params;

    try {
      await apiConnector.post({
        url: `refresh-token`,
        data: { refreshToken },
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response) {
        throw new Error(e.response.data.error);
      }
      throw e;
    }
  }
}
