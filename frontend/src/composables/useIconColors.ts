import { allIcons } from "./iconConfig";

const defaultColor = "#888888";

export function useIconColors() {
  const getIconColor = (source: string): string => {
    if (!source) return defaultColor;
    const icon = allIcons.find((i) => i.name === source);
    return icon?.color || defaultColor;
  };

  return { getIconColor };
}