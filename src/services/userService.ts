import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import {
  SaveUserData,
  UserToken,
  User,
  UserServerResponse,
} from "./interfaces";
import ServerConfig from "@/controllers/serverConfigController";

import axios from "axios";
import { apiConnector } from "@/main";

export default class UserService {
  async getUser(): Promise<User> {
    try {
      const response = (await apiConnector.get({
        url: `user-auth`,
      })) as UserServerResponse;

      return {
        id: response.id,
        name: response.name,
        email: response.email,
        user: response.user,
        imageProfile: response.image_profile,
        isAdmin: response.is_admin,
      };
    } catch (error: any) {
      if (error.response && error.response.data.message == "Unauthenticated.")
        throw new Error("Unauthorized");
      throw error;
    }
  }

  async setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  async saveUserData(params: SaveUserData): Promise<void> {
    const { name, user, email, imageId } = params;

    await apiConnector.post({
      url: `update-user`,
      data: { name, user, email, imageId },
    });
  }

  async deleteUserAccount(params: { password: string }): Promise<void> {
    const { password } = params;

    await apiConnector.post({
      url: `delete-user`,
      data: { password },
    });
  }

  async resendEmailConfirmation(params: { password: string }): Promise<void> {
    const { password } = params;

    // // TODO: Pending
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
