import { System, Theme } from "@/services/interfaces";
import { DesignMode } from "@/utils/types";
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
  const designMode = ref<DesignMode>("md");
  const screenSize = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
    preset: "",
  });

  window.addEventListener("resize", updateScreenSize);

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

  function getDesignMode(): DesignMode {
    return designMode.value;
  }

  function setDesignMode(params: { mode: DesignMode }) {
    const { mode } = params;
    designMode.value = mode;
  }

  function updateScreenSize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let preset = "xxl";

    if (width < 576) preset = "xs";
    else if (width < 768) preset = "sm";
    else if (width < 992) preset = "md";
    else if (width < 1200) preset = "lg";
    else if (width < 1400) preset = "xl";

    Object.assign(screenSize, {
      width,
      height,
      preset,
    });
  }

  return {
    theme,
    getThemeSelected,
    updateThemeSelected,
    toggleUpdateOption,
    update,
    loader,
    updateLoader,
    designMode,
    getDesignMode,
    setDesignMode,
    screenSize,
  };
});
