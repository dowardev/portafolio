import type { Theme } from "./interfaces";

/**
 * Single source of truth for the default theme.
 *
 * Change the default template/theme/variant HERE only. Never hardcode
 * template or theme literals in stores, controllers, or views — import
 * this constant instead so every layer stays in sync.
 */
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
