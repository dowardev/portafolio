import { defineStore } from "pinia";
import { User } from "../services/interfaces";
import userAvatar from "@/assets/otros/user.png";

interface UserState {
  user: User;
  token: string;
  isLogged: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: {} as User,
    token: "",
    isLogged: false,
  }),

  getters: {
    imageProfile(state) {
      const imageProfile = state.user.imageProfile;
      if (imageProfile) return "data:image/png;base64," + imageProfile;
      return userAvatar;
    },
  },

  actions: {
    updateUserProps(props: User) {
      const userProps = this.user;
      const merge = {
        ...userProps,
        ...props,
      };
      this.user = merge;
    },

    updateUserLoggedProp(isLogged: boolean) {
      this.isLogged = isLogged;
    },

    updateTokenProp(token: string) {
      this.token = token;
    },

    logout() {
      this.user = {};
    },
  },
});
