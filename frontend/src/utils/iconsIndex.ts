export type IconSource = "ionicons" | "lineicons" | "all";

export interface UnifiedIconConfig {
  name: string;
  label: string;
  color: string;
  type: "social" | "tech";
  source: IconSource;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

import {
  allIcons as ioniconsAll,
} from "@/config/iconConfig";
import {
  allLineIcons as lineiconsAll,
} from "@/config/lineiconsConfig";

export function getUnifiedIcons(): UnifiedIconConfig[] {
  const ionicons: UnifiedIconConfig[] = ioniconsAll.map((icon) => ({
    name: icon.name,
    label: icon.label,
    color: icon.color,
    type: icon.type,
    source: "ionicons" as IconSource,
    icon: icon.icon,
  }));

  const lineicons: UnifiedIconConfig[] = lineiconsAll.map((icon) => ({
    name: icon.name,
    label: icon.label,
    color: icon.color,
    type: icon.type,
    source: "lineicons" as IconSource,
    icon: icon.icon,
  }));

  return [...ionicons, ...lineicons];
}

export function getIconsBySource(source: IconSource): UnifiedIconConfig[] {
  if (source === "all") return getUnifiedIcons();
  return getUnifiedIcons().filter((icon) => icon.source === source);
}

export function getIconsByType(
  type: "social" | "tech" | "all"
): UnifiedIconConfig[] {
  const icons = getUnifiedIcons();
  if (type === "all") return icons;
  return icons.filter((icon) => icon.type === type);
}

export function getIconsBySourceAndType(
  source: IconSource,
  type: "social" | "tech" | "all"
): UnifiedIconConfig[] {
  let icons = getIconsBySource(source);
  if (type !== "all") {
    icons = icons.filter((icon) => icon.type === type);
  }
  return icons;
}

export function getIconByName(name: string): UnifiedIconConfig | undefined {
  return getUnifiedIcons().find((icon) => icon.name === name);
}

export function getIonIconSvg(name: string): string | undefined {
  const icon = getIconByName(name);
  if (icon?.source === "lineicons") return undefined;
  return icon?.icon as string || undefined;
}

export function getLineIconComponent(name: string): object | undefined {
  const icon = getIconByName(name);
  if (icon?.source !== "lineicons") return undefined;
  return icon?.icon as object;
}

export function isLineIcon(name: string): boolean {
  const icon = getIconByName(name);
  return icon?.source === "lineicons";
}

export function getIconColor(name: string): string {
  const icon = getIconByName(name);
  return icon?.color || "#666666";
}

export function searchIcons(query: string): UnifiedIconConfig[] {
  const search = query.toLowerCase();
  return getUnifiedIcons().filter(
    (icon) =>
      icon.label.toLowerCase().includes(search) ||
      icon.name.toLowerCase().includes(search)
  );
}