import { defineStore } from "pinia";
import { User } from "../services/interfaces";
import userAvatar from "@/assets/otros/user.png";
import { ref } from "vue";

interface UsersState {
  users: User[];
}

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);

  // getters: {
  //   imageProfile(state) {
  //     const imageProfile = state.user.imageProfile;
  //     if (imageProfile) return "data:image/png;base64," + imageProfile;
  //     return userAvatar;
  //   },
  // },

  function updateUsersProps(params: { users: Array<User> }) {
    const { users: usersParams } = params;
    users.value = usersParams;
  }

  return {
    users,
    updateUsersProps,
  };
});
