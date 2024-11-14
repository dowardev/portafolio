import { defineStore } from "pinia";
import { User } from "../services/interfaces";
import userAvatar from "@/assets/otros/user.png";

interface UserState {
  user: User;
  token: string;
  isLogged: boolean;
}

export const useUserStore = defineStore("user", () => {
  const user = {} as User;
  const token = "";
  const isLogged = false;

  function imageProfile(state) {
    const imageProfile = state.user.imageProfile;
    if (imageProfile) return "data:image/png;base64," + imageProfile;
    return userAvatar;
  }

  function updateUserProps(props: User) {
    const userProps = user;
    const merge = {
      ...userProps,
      ...props,
    };
    user = merge;
  }

  function updateUserLoggedProp(isLogged: boolean) {
    isLogged = isLogged;
  }

  function updateTokenProp(token: string) {
    token = token;
  }

  function logout() {
    user = {};
  }

  return {
    user,
    token,
    isLogged,
    imageProfile,
    updateUserProps,
    updateUserLoggedProp,
    updateTokenProp,
    logout,
  };
});
