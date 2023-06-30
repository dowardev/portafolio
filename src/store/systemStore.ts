import { System } from "@/services/interfaces";
import { Theme } from "@/services/types";
import { defineStore } from "pinia";

interface SystemState {
  theme: "dark" | "light";
}
interface SystemState {
  system: System;
}

export const useSystemStore = defineStore("system", {
  state: (): SystemState => ({
    theme: "dark",
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
    setThemeSelected(params: { theme: Theme }) {
      const theme = params.theme;
      this.system.theme.selected = theme;
    },
  },
});
