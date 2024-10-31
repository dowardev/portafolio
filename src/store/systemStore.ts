import { System, Theme } from "@/services/interfaces";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { useSystem } from "@/composables/useSystem";

export const useSystemStore = defineStore("system", () => {
  const theme = ref({
    selected: "light",
  } as Theme);
  const update = ref(false);

  const systemComposable = useSystem();

  watch(theme, async (newValue, oldValue) => {
    if (
      oldValue.selected != newValue.selected ||
      oldValue.options?.blur != newValue.options?.blur
    ) {
      await systemComposable.storeThemeSelected({ theme: theme.value });
      systemComposable.applyTheme({ newTheme: newValue, oldTheme: oldValue });
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

  return {
    theme,
    getThemeSelected,
    updateThemeSelected,
    toggleUpdateOption,
    update,
  };
});
