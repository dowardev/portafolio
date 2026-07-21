import { Theme } from "@/utils/interfaces";
import { DesignMode, HomeTemplate, ConcreteTheme } from "@/utils/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSystemStore = defineStore("system", () => {
  const theme = ref({
    selected: "light",
    template: "template3" as HomeTemplate,
    variant: "light" as ConcreteTheme,
    options: { blur: false, lightTheme: "light" as ConcreteTheme, darkTheme: "catppuccin-macchiato" as ConcreteTheme },
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

  function getTemplate(): HomeTemplate {
    return theme.value.template;
  }

  function setTemplate(params: { template: HomeTemplate }): void {
    const { template } = params;
    theme.value.template = template;
  }

  function getVariant(): ConcreteTheme {
    return theme.value.variant;
  }

  function setVariant(params: { variant: ConcreteTheme }): void {
    const { variant } = params;
    theme.value.variant = variant;
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
    getTemplate,
    setTemplate,
    getVariant,
    setVariant,
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
