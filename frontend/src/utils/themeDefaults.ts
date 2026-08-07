import type { Theme } from "./interfaces";
import type { ConcreteTheme } from "./types";

/**
 * Single source of truth for the default theme.
 *
 * Change the default template/theme/variant HERE only. Never hardcode
 * template or theme literals in stores, controllers, or views — import
 * this constant instead so every layer stays in sync.
 */

/** Every concrete variant the theme system supports (CSS lives in theme/*.css). */
export const CONCRETE_THEMES: ConcreteTheme[] = [
  "light",
  "nord",
  "gruvbox",
  "catppuccin-latte",
  "catppuccin-macchiato",
  "cyberpunk-light",
];

/** Variants usable as the light side of "auto" mode (light backgrounds). */
export const LIGHT_COMPATIBLE_THEMES: ConcreteTheme[] = [
  "light",
  "nord",
  "gruvbox",
  "catppuccin-latte",
  "cyberpunk-light",
];

/** Variants usable as the dark side of "auto" mode (dark backgrounds). */
export const DARK_COMPATIBLE_THEMES: ConcreteTheme[] = ["catppuccin-macchiato"];

export const DEFAULT_THEME: Theme = {
  selected: "light",
  template: "template3",
  variant: "light",
  options: {
    blur: false,
    lightTheme: "light",
    darkTheme: "catppuccin-macchiato",
  },
};
