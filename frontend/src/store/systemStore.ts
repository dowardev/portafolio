import { Theme } from "@/utils/interfaces";
import { DesignMode } from "@/utils/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSystemStore = defineStore("system", () => {
  const theme = ref({
    selected: "light",
    options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
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
  const errorReport = reactive({
    message: "",
    stack: "",
    timestamp: "",
    comments: "",
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

  function updateScreenSize(params: {
    width: number;
    height: number;
    preset: string;
  }): void {
    const { width, height, preset } = params;

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
    updateScreenSize,
    errorReport,
  };
});
