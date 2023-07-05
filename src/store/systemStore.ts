import { System, Theme } from "@/services/interfaces";
import { defineStore } from "pinia";

interface SystemState {
  system: System;
}

export const useSystemStore = defineStore("system", {
  state: (): SystemState => ({
    system: { theme: { selected: "light", options: { blur: false } } },
  }),

  getters: {
    // imageProfile(state) {
    //   const imageProfile = state.user.imageProfile;
    //   if (imageProfile) return "data:image/png;base64," + imageProfile;
    //   return userAvatar;
    // },

    getThemeSelected(state) {
      return (): Theme => {
        return JSON.parse(JSON.stringify(state.system.theme));
      };
    },
  },

  actions: {
    setThemeSelected(params: { theme: Theme }) {
      const { theme } = params;
      this.system.theme = theme;
      console.log(this.system.theme);
    },
  },
});
