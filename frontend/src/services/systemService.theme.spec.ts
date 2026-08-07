import { describe, it, expect, vi } from "vitest";
import SystemService from "@/services/systemService";
import type { Theme } from "@/utils/interfaces";

// Mock @/main: the service imports storageInstance from there, but importing the
// real module pulls in the SSO bootstrap and top-level side effects.
// The getter is live: tests swap `currentFakeStorage` between driver modes.
vi.mock("@/main", () => ({
  get storageInstance() {
    return currentFakeStorage;
  },
}));

// Mock the API connector: the service imports it but the theme methods never call it.
vi.mock("@/apiConnector", () => ({
  getApiConnector: vi.fn(),
}));

/**
 * Faithful localforage storage behavior:
 * - set: always JSON.stringify (localforage serialize step, non-blob path)
 * - get: IndexedDB driver returns the raw string; localStorage driver deserializes.
 */
function createFakeStorage(mode: "idb" | "localstorage") {
  const store = new Map<string, unknown>();
  return {
    async set(key: string, value: unknown): Promise<void> {
      store.set(key, JSON.stringify(value));
    },
    async get(key: string): Promise<unknown> {
      const value = store.get(key);
      if (value === undefined || value === null) return null;
      if (mode === "idb") return value; // raw, no deserialize
      return JSON.parse(value as string); // deserialize
    },
  };
}

let currentFakeStorage = createFakeStorage("idb");

const themeTemplate2: Theme = {
  selected: "nord",
  template: "template2",
  variant: "nord",
  options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
};

describe("SystemService theme persistence (double-serialization regression)", () => {
  it("roundtrips the theme object under the IndexedDB driver (raw getItem)", async () => {
    currentFakeStorage = createFakeStorage("idb");
    const service = new SystemService();
    await service.storeThemeSelected({ theme: themeTemplate2 });

    const stored = await service.getTheme();
    expect(stored).not.toBeNull();
    if (!stored) throw new Error("expected a stored theme");
    expect(stored.template).toBe("template2");
    expect(stored.selected).toBe("nord");
    expect(stored.variant).toBe("nord");
  });

  it("roundtrips the theme object under the localStorage driver (deserialized getItem)", async () => {
    currentFakeStorage = createFakeStorage("localstorage");
    const service = new SystemService();
    await service.storeThemeSelected({ theme: themeTemplate2 });

    const stored = await service.getTheme();
    expect(stored).not.toBeNull();
    if (!stored) throw new Error("expected a stored theme");
    expect(stored.template).toBe("template2");
    expect(stored.selected).toBe("nord");
  });

  it("returns null on clean install (no stored value)", async () => {
    currentFakeStorage = createFakeStorage("idb");
    const service = new SystemService();
    const stored = await service.getTheme();
    expect(stored).toBeNull();
  });

  it("survives a reload cycle under the IndexedDB driver (write -> new read)", async () => {
    currentFakeStorage = createFakeStorage("idb");
    const service = new SystemService();
    await service.storeThemeSelected({ theme: themeTemplate2 });

    // Simulates a fresh app load: a new service instance reads what was persisted.
    const freshService = new SystemService();
    const stored = await freshService.getTheme();
    expect(stored).not.toBeNull();
    if (!stored) throw new Error("expected a stored theme");
    expect(stored.template).toBe("template2");
  });
});

describe("SystemService applyTheme (blur + css classes)", () => {
  it("swaps the resolved css class on the body", () => {
    const service = new SystemService();
    document.body.className = "light";
    service.applyTheme({
      theme: themeTemplate2,
      resolvedSelected: "nord",
      currentTheme: themeTemplate2,
      resolvedCurrentSelected: "light",
    });
    expect(document.body.classList.contains("nord")).toBe(true);
    expect(document.body.classList.contains("light")).toBe(false);
  });

  it("sets data-blur when theme.options.blur is true", () => {
    const service = new SystemService();
    document.body.removeAttribute("data-blur");
    service.applyTheme({
      theme: { ...themeTemplate2, options: { blur: true, lightTheme: "light", darkTheme: "catppuccin-macchiato" } },
      resolvedSelected: "nord",
      currentTheme: themeTemplate2,
      resolvedCurrentSelected: "light",
    });
    expect(document.body.getAttribute("data-blur")).toBe("true");
  });

  it("removes data-blur when theme.options.blur is false or missing", () => {
    const service = new SystemService();
    document.body.setAttribute("data-blur", "true");
    service.applyTheme({
      theme: { ...themeTemplate2, options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" } },
      resolvedSelected: "nord",
      currentTheme: themeTemplate2,
      resolvedCurrentSelected: "light",
    });
    expect(document.body.hasAttribute("data-blur")).toBe(false);
  });
});
