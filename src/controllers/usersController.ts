import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { User } from "../services/interfaces";
import { deleteUserAccount, getUser } from "../services/user";

// controllers
// import SystemController from "./systemController";

export default class UsersController {
  userStore = useUserStore();
  user = storeToRefs(this.userStore);
  imageProfile = storeToRefs(this.userStore);
  token = storeToRefs(this.userStore);
  isLogged = storeToRefs(this.userStore);
  // systemController = new SystemController();

  // openToastError = this.systemController.openToastError;

  async loadUser() {
    try {
      const user = await getUser();

      this.updateUserProps({ user });
    } catch (error: any) {
      if (error.message != "Unauthorized") throw error;
    }
  }

  updateUserProps(params: { user: User }) {
    this.userStore.updateUserProps(params.user);
  }

  async updateUserAdminProp(params: { refetch: boolean }) {
    try {
      const { isAdmin } = await getUser();
      this.userStore.updateUserProps({ isAdmin });
    } catch (error: any) {
      if (error.message == "Unauthorized") return;
      // this.openToastError(error);
      throw error.message;
    }
  }

  updateUserLoggedProp(isLogged: boolean) {
    this.userStore.updateUserLoggedProp(isLogged);
  }

  updateUserTokenProp(token: string) {
    this.userStore.updateTokenProp(token);
  }

  async deleteAccount(params: { password: string }) {
    try {
      await deleteUserAccount({
        password: params.password,
      });

      // await logout();
    } catch (e: any) {
      throw e;
    }
  }
}
