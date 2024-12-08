import { System, Theme } from "@/services/interfaces";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

// controllers
// import SystemController from "@/composables/useSystem";

export const useSystemStore = defineStore("system", () => {
  // const systemController = new SystemController();
  const theme = ref({
    selected: "light",
  } as Theme);
  const update = ref(false);
  const loader = ref<{ status: boolean; color: string }>({
    status: false,
    color: "",
  });

  watch(theme, async (newValue, oldValue) => {
    if (
      oldValue.selected != newValue.selected ||
      oldValue.options?.blur != newValue.options?.blur
    ) {
      // await systemController.storeThemeSelected({ theme: theme.value });
      // systemController.applyTheme({ newTheme: newValue, oldTheme: oldValue });
    }
  });

  function getThemeSelected(): Theme {
    return theme.value;
  }

  function updateThemeSelected(params: { theme: Theme }): void {
    const { theme: themeData } = params;
    theme.value = themeData;
  }

  function toggleUpdateOption() {
    update.value = !update.value;
  }

  function updateLoader(params: { status: boolean; color?: string }) {
    const { status, color = "primary" } = params;
    loader.value = { status, color };
  }

  return {
    theme,
    getThemeSelected,
    updateThemeSelected,
    toggleUpdateOption,
    update,
    loader,
    updateLoader,
  };
});
