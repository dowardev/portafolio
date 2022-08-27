import { defineStore } from "pinia";
import { User } from "../services/interfaces";
import userAvatar from "@/assets/otros/user.png";

interface UsersState {
  users: User[];
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    users: Array<User>(),
  }),

  // getters: {
  //   imageProfile(state) {
  //     const imageProfile = state.user.imageProfile;
  //     if (imageProfile) return "data:image/png;base64," + imageProfile;
  //     return userAvatar;
  //   },
  // },

  actions: {
    updateUsersProps(params: { users: Array<User> }) {
      const users = params.users;
      this.users = users;
    },
  },
});
