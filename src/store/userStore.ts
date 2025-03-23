import { defineStore } from "pinia";
import { User } from "../utils/interfaces";
import userAvatar from "@/assets/otros/user.png";
import { ref } from "vue";

interface UserState {
  user: User;
  token: string;
  isLogged: boolean;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<undefined | User>(undefined);
  const token = ref<string>("");
  const isLogged = ref<boolean>(false);

  function imageProfile() {
    const imageProfile = user.value?.imageProfile;
    if (imageProfile) return "data:image/png;base64," + imageProfile;
    return userAvatar;
  }

  function updateUserProps(params: User) {
    const userParam = params;
    user.value = userParam;
  }

  function updateUserLoggedProp(isLogged: boolean) {
    isLogged = isLogged;
  }

  function updateTokenProp(token: string) {
    token = token;
  }

  function logout() {
    user.value = undefined;
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
