import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import { getApiConnector } from "@/apiConnector";

import {
  User,
  UserServerResponse,
} from "../utils/interfaces";

export default class UserService {
  async getUser(): Promise<User | undefined> {
    const response = await getApiConnector().get<UserServerResponse>("user-auth");

    if (response) return this.formatUserResponse({ response });
    else return undefined;
  }

  async setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  formatUserResponse(params: { response: UserServerResponse }): User {
    const { response } = params;

    return {
      id: response.id?.toString(),
      name: response.name,
      user: response.user,
      email: response.email,
      roles: response.roles ?? [],
      isEmailVerified: response.is_email_verified,
      isDisabled: response.is_user_disabled,
    };
  }
}
