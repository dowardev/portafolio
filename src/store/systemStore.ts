import { defineStore } from "pinia";

interface SystemState {
  theme: "dark" | "light";
  menuCollapse: boolean;
}

export const useSystemStore = defineStore("system", {
  state: (): SystemState => ({
    theme: "dark",
    menuCollapse: false,
  }),

  // getters: {
  //   imageProfile(state) {
  //     const imageProfile = state.user.imageProfile;
  //     if (imageProfile) return "data:image/png;base64," + imageProfile;
  //     return userAvatar;
  //   },
  // },

  actions: {
    changeMenuCollapse(params: { option: boolean }) {
      const option = params.option;
      this.menuCollapse = option;
    },
  },
});
