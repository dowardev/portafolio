import { System, Theme } from "@/services/interfaces";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { useSystem } from "@/composables/useSystem";

export const useSystemStore = defineStore("system", () => {
  const theme = ref({
    selected: "light",
    options: { blur: false },
  } as Theme);

  const systemComposable = useSystem();

  watch(theme, async (newValue, oldValue) => {
    if (
      oldValue.selected != newValue.selected ||
      oldValue.options?.blur != newValue.options?.blur
    ) {
      console.log("cambio");
      await systemComposable.storeThemeSelected({ theme: theme.value });
      systemComposable.applyTheme({ newTheme: newValue, oldTheme: oldValue });
    }
  });

  function getThemeSelected(): Theme {
    return theme.value;
  }

  function setThemeSelected(params: { theme: Theme }): void {
    const { theme: themeData } = params;
    console.log(themeData);
    theme.value = themeData;
  }

  return {
    theme,
    getThemeSelected,
    setThemeSelected,
  };
});
