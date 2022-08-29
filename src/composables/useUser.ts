import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { Graphql, User } from "../services/interfaces";
import { deleteUserAccount, getUser } from "../services/user";
import { USER_PERMISSIONS } from "../services/graphql";
import { openToastErrror } from "../services/system";
import { logout as userLogout } from "../services/session";

export const useUser = () => {
  const userStore = useUserStore();
  const user = storeToRefs(userStore).user;
  const imageProfile = storeToRefs(userStore).imageProfile;
  const token = storeToRefs(userStore).token;
  const isLogged = storeToRefs(userStore).isLogged;

  async function loadUser(params: { graphql: Graphql }) {
    try {
      let user = await getUser({
        graphql: {
          name: params.graphql.name,
          fragment: params.graphql.fragment,
          refetch: params.graphql.refetch,
        },
      });

      updateUserProps({ user });
    } catch (error: any) {
      if (error.message == "Unauthorized") return;
      openToastErrror(error);
      throw error.message;
    }
  }

  function updateUserProps(params: { user: User }) {
    userStore.updateUserProps(params.user);
  }

  async function updateUserAdminProp(params: { refetch: boolean }) {
    try {
      let { isAdmin } = await getUser({
        graphql: {
          name: USER_PERMISSIONS,
          fragment: "UserPermissions",
          refetch: params.refetch,
        },
      });
      userStore.updateUserProps({ isAdmin });
    } catch (error: any) {
      if (error.message == "Unauthorized") return;
      openToastErrror(error);
      throw error.messge;
    }
  }

  function updateUserLoggedProp(isLogged: boolean) {
    userStore.updateUserLoggedProp(isLogged);
  }

  function updateUserTokenProp(token: string) {
    userStore.updateTokenProp(token);
  }

  async function logout() {
    try {
      await userLogout();
      userStore.logout();
      updateUserLoggedProp(false);
      updateUserTokenProp("");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (e: any) {
      console.error(e);
      openToastErrror(e);
    }
  }

  async function deleteAccount(params: { password: string }) {
    try {
      await deleteUserAccount({
        password: params.password,
      });

      await logout();
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
    logout,
    deleteAccount,

    // props
    user,
    token,
    isLogged,

    // computed
    imageProfile,
  };
};
