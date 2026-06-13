import { getIconColor as getColor } from "@/utils/iconsIndex";

const defaultColor = "#888888";

export function useIconColors() {
  const getIconColor = (source: string): string => {
    if (!source) return defaultColor;
    return getColor(source) || defaultColor;
  };

  return { getIconColor };
}