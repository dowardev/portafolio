import { defineStore } from "pinia";
import { User } from "../utils/interfaces";
import userAvatar from "@/assets/otros/user.png";
import { ref } from "vue";

interface UserState {
  user: User;
  isLogged: boolean;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<undefined | User>(undefined);
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

  function updateUserLoggedProp(isLoggedParam: boolean) {
    isLogged.value = isLoggedParam;
  }

  function logout() {
    user.value = undefined;
  }

  return {
    user,
    isLogged,
    imageProfile,
    updateUserProps,
    updateUserLoggedProp,
    logout,
  };
});
