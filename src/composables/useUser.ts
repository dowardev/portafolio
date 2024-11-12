import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { User } from "../services/interfaces";
import { deleteUserAccount, getUser } from "../services/user";
import { useSystem } from "./useSystem";

export const useUser = () => {
  const userStore = useUserStore();
  const { user, imageProfile, token, isLogged } = storeToRefs(userStore);

  const openToastError = useSystem().openToastError;

  async function loadUser() {
    try {
      const user = await getUser();

      updateUserProps({ user });
    } catch (error: any) {
      if (error.message != "Unauthorized") throw error;
    }
  }

  function updateUserProps(params: { user: User }) {
    userStore.updateUserProps(params.user);
  }

  async function updateUserAdminProp(params: { refetch: boolean }) {
    try {
      const { isAdmin } = await getUser();
      userStore.updateUserProps({ isAdmin });
    } catch (error: any) {
      if (error.message == "Unauthorized") return;
      openToastError(error);
      throw error.messge;
    }
  }

  function updateUserLoggedProp(isLogged: boolean) {
    userStore.updateUserLoggedProp(isLogged);
  }

  function updateUserTokenProp(token: string) {
    userStore.updateTokenProp(token);
  }

  async function deleteAccount(params: { password: string }) {
    try {
      await deleteUserAccount({
        password: params.password,
      });

      // await logout();
    } catch (e: any) {
      throw e;
    }
  }

  return {
    // functions
    loadUser,
    updateUserAdminProp,
    updateUserLoggedProp,
    updateUserToken: updateUserTokenProp,
    updateUserProps,
    deleteAccount,

    // props
    user,
    token,
    isLogged,

    // computed
    imageProfile,
  };
};
