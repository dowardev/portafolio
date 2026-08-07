import { describe, it, expect, vi, beforeEach } from "vitest";
import SystemController from "@/controllers/systemController";
import type { Theme } from "@/utils/interfaces";
import { DEFAULT_THEME } from "@/utils/themeDefaults";

// Mock @/main: systemController imports wb and SystemService imports storageInstance.
vi.mock("@/main", () => ({
  wb: undefined,
  get storageInstance() {
    return currentFakeStorage;
  },
}));

// Mock the API connector: SystemService imports it but theme methods never call it.
vi.mock("@/apiConnector", () => ({
  getApiConnector: vi.fn(),
}));

// Mock the Pinia store: the controller instantiates useSystemStore() in its constructor.
vi.mock("@/store/systemStore", () => ({
  useSystemStore: () => mockSystemStore,
}));

// Mock the error controller: it imports heavy deps we do not need here.
vi.mock("@/controllers/errorController", () => ({
  default: class {
    handleError() {}
  },
}));

const mockSystemStore = {
  getThemeSelected: vi.fn(() => ({ ...DEFAULT_THEME })),
  updateThemeSelected: vi.fn(),
  getTemplate: vi.fn(() => DEFAULT_THEME.template),
  setTemplate: vi.fn(),
  getVariant: vi.fn(() => DEFAULT_THEME.variant),
  setVariant: vi.fn(),
  toggleUpdateOption: vi.fn(),
  updateLoader: vi.fn(),
  getDesignMode: vi.fn(() => "md"),
  setDesignMode: vi.fn(),
  updateScreenSize: vi.fn(),
  update: false,
  loader: { status: false, color: "" },
  screenSize: { width: 1280, height: 720, preset: "" },
};

const currentFakeStorage = {
  async set() {},
  async get() {
    return null;
  },
};

const themeTemplate3: Theme = {
  selected: "light",
  template: "template3",
  variant: "light",
  options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
};

const themeTemplate2Nord: Theme = {
  selected: "nord",
  template: "template2",
  variant: "nord",
  options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
};

describe("SystemController theme logic", () => {
  let controller: SystemController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new SystemController();
  });

  describe("resolveAutoTheme", () => {
    it("returns the concrete selected value when not auto", () => {
      expect(controller.resolveAutoTheme({ theme: themeTemplate2Nord })).toBe("nord");
    });

    it("returns darkTheme when auto and the OS prefers dark", () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal("matchMedia", matchMediaMock);

      const autoTheme: Theme = {
        ...themeTemplate3,
        selected: "auto",
        options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
      };
      expect(controller.resolveAutoTheme({ theme: autoTheme })).toBe("catppuccin-macchiato");
      vi.unstubAllGlobals();
    });

    it("returns lightTheme when auto and the OS prefers light", () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: false });
      vi.stubGlobal("matchMedia", matchMediaMock);

      const autoTheme: Theme = {
        ...themeTemplate3,
        selected: "auto",
        options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
      };
      expect(controller.resolveAutoTheme({ theme: autoTheme })).toBe("light");
      vi.unstubAllGlobals();
    });
  });

  describe("applyTheme", () => {
    it("maps template2 to the resolved variant and other templates to light", () => {
      const applyThemeSpy = vi.spyOn(controller.systemService, "applyTheme").mockImplementation(() => {});

      controller.applyTheme({ newTheme: themeTemplate2Nord, oldTheme: themeTemplate3 });

      expect(applyThemeSpy).toHaveBeenCalledWith({
        theme: themeTemplate2Nord,
        resolvedSelected: "nord",
        currentTheme: themeTemplate3,
        resolvedCurrentSelected: "light",
      });
    });

    it("resolves the auto mode to darkTheme when the OS prefers dark", () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal("matchMedia", matchMediaMock);
      const applyThemeSpy = vi.spyOn(controller.systemService, "applyTheme").mockImplementation(() => {});

      const autoTheme: Theme = {
        ...themeTemplate3,
        template: "template2",
        selected: "auto",
        variant: "light",
        options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
      };
      controller.applyTheme({ newTheme: autoTheme, oldTheme: themeTemplate3 });

      expect(applyThemeSpy).toHaveBeenCalledWith({
        theme: autoTheme,
        resolvedSelected: "catppuccin-macchiato",
        currentTheme: themeTemplate3,
        resolvedCurrentSelected: "light",
      });
      vi.unstubAllGlobals();
    });
  });

  describe("buildThemeForTemplate (savedVariant persistence)", () => {
    it("records the current variant when leaving template2 and forces light", () => {
      const next = controller.buildThemeForTemplate({
        currentTheme: themeTemplate2Nord,
        template: "template1",
      });
      expect(next.template).toBe("template1");
      expect(next.variant).toBe("light");
      expect(next.savedVariant).toBe("nord");
    });

    it("restores the saved variant when re-entering template2", () => {
      const current: Theme = {
        ...themeTemplate3,
        template: "template1",
        savedVariant: "nord",
      };
      const next = controller.buildThemeForTemplate({
        currentTheme: current,
        template: "template2",
      });
      expect(next.template).toBe("template2");
      expect(next.variant).toBe("nord");
      expect(next.savedVariant).toBeUndefined();
    });

    it("keeps savedVariant when switching between non-template2 templates", () => {
      const current: Theme = {
        ...themeTemplate3,
        template: "template1",
        savedVariant: "nord",
      };
      const next = controller.buildThemeForTemplate({
        currentTheme: current,
        template: "template3",
      });
      expect(next.template).toBe("template3");
      expect(next.variant).toBe("light");
      expect(next.savedVariant).toBe("nord");
    });

    it("does not record light as a saved variant when leaving template2", () => {
      const current: Theme = {
        ...themeTemplate3,
        template: "template2",
        variant: "light",
        selected: "light",
      };
      const next = controller.buildThemeForTemplate({
        currentTheme: current,
        template: "template1",
      });
      expect(next.savedVariant).toBeUndefined();
    });
  });

  describe("buildThemeForVariant", () => {
    it("updates selected, variant and records the chosen variant as savedVariant", () => {
      const next = controller.buildThemeForVariant({
        currentTheme: themeTemplate3,
        variant: "gruvbox",
      });
      expect(next.selected).toBe("gruvbox");
      expect(next.variant).toBe("gruvbox");
      expect(next.savedVariant).toBe("gruvbox");
    });
  });

  describe("buildThemeForAuto", () => {
    it("sets selected to auto while keeping the current variant and savedVariant", () => {
      const current: Theme = {
        ...themeTemplate2Nord,
        savedVariant: "gruvbox",
      };
      const next = controller.buildThemeForAuto({ currentTheme: current });
      expect(next.selected).toBe("auto");
      expect(next.variant).toBe("nord");
      expect(next.savedVariant).toBe("gruvbox");
    });
  });

  describe("buildThemeForAutoLightTheme / buildThemeForAutoDarkTheme", () => {
    it("updates only options.lightTheme", () => {
      const next = controller.buildThemeForAutoLightTheme({
        currentTheme: themeTemplate3,
        lightTheme: "catppuccin-latte",
      });
      expect(next.options?.lightTheme).toBe("catppuccin-latte");
      expect(next.options?.darkTheme).toBe("catppuccin-macchiato");
      expect(next.template).toBe("template3");
    });

    it("updates only options.darkTheme", () => {
      const next = controller.buildThemeForAutoDarkTheme({
        currentTheme: themeTemplate3,
        darkTheme: "cyberpunk-light",
      });
      expect(next.options?.lightTheme).toBe("light");
      expect(next.options?.darkTheme).toBe("cyberpunk-light");
      expect(next.template).toBe("template3");
    });
  });

  describe("onSystemColorSchemeChange", () => {
    it("re-applies the theme when the selected mode is auto", () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal("matchMedia", matchMediaMock);

      const autoTheme: Theme = {
        ...themeTemplate3,
        selected: "auto",
        options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
      };
      mockSystemStore.getThemeSelected.mockReturnValueOnce(autoTheme);
      const applyThemeSpy = vi.spyOn(controller, "applyTheme");

      controller.onSystemColorSchemeChange();

      expect(applyThemeSpy).toHaveBeenCalledTimes(1);
      vi.unstubAllGlobals();
    });

    it("does nothing when the selected mode is concrete", () => {
      mockSystemStore.getThemeSelected.mockReturnValueOnce(themeTemplate3);
      const applyThemeSpy = vi.spyOn(controller, "applyTheme");

      controller.onSystemColorSchemeChange();

      expect(applyThemeSpy).not.toHaveBeenCalled();
    });
  });

  describe("changeTheme", () => {
    it("persists the new theme to storage after updating the store", async () => {
      const storageSetSpy = vi.spyOn(controller.systemService, "storeThemeSelected").mockResolvedValue();
      const storeSpy = vi.spyOn(controller.systemStore, "updateThemeSelected").mockImplementation(() => {});
      const applyThemeSpy = vi.spyOn(controller.systemService, "applyTheme").mockImplementation(() => {});

      await controller.changeTheme({ newTheme: themeTemplate2Nord, oldTheme: themeTemplate3 });

      expect(storeSpy).toHaveBeenCalledWith({ theme: themeTemplate2Nord });
      expect(applyThemeSpy).toHaveBeenCalledWith({
        theme: themeTemplate2Nord,
        resolvedSelected: "nord",
        currentTheme: themeTemplate3,
        resolvedCurrentSelected: "light",
      });
      expect(storageSetSpy).toHaveBeenCalledWith({ theme: themeTemplate2Nord });
    });
  });
});
