import { System } from "@/services/interfaces";
import { defineStore } from "pinia";

interface SystemState {
  theme: "dark" | "light";
  menuCollapse: boolean;
}
interface SystemState {
  system: System;
}

export const useSystemStore = defineStore("system", {
  state: (): SystemState => ({
    theme: "dark",
    menuCollapse: false,
    system: { theme: { selected: "light" } },
  }),

  getters: {
    // imageProfile(state) {
    //   const imageProfile = state.user.imageProfile;
    //   if (imageProfile) return "data:image/png;base64," + imageProfile;
    //   return userAvatar;
    // },
    getThemeSelected(state) {
      return () => {
        return state.system.theme.selected;
      };
    },
  },

  actions: {
    changeMenuCollapse(params: { option: boolean }) {
      const option = params.option;
      this.menuCollapse = option;
    },

    setThemeSelected(params: { theme: Theme }) {
      const theme = params.theme;
      this.system.theme.selected = theme;
    },
  },
});
