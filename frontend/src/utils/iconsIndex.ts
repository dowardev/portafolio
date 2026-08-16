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

/**
 * Normalize an icon name for tolerant lookup: lowercase, drop the "logo"
 * prefix used by ionicons entries and the "Outlined"/"Filled" suffix used by
 * lineicons entries, and remove separators. "docker", "logoDocker" and
 * "DockerOutlined" all normalize to "docker".
 */
function normalizeIconName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(logo)/, "")
    .replace(/(outlined|filled)$/, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Explicit aliases for slugs that normalization cannot derive from the icon
 * name. The seed controller writes TECH_NAMES slugs ("node"); the catalog
 * entry is "NodejsOutlined", which normalizes to "nodejs", not "node".
 */
const ICON_NAME_ALIASES: Record<string, string> = {
  node: "NodejsOutlined",
};

export function getIconByName(name: string): UnifiedIconConfig | undefined {
  const icons = getUnifiedIcons();
  const alias = ICON_NAME_ALIASES[name.toLowerCase()];
  const lookupName = alias ?? name;
  // Fast path: exact match, preserves any caller relying on precise names.
  const exact = icons.find((icon) => icon.name === lookupName);
  if (exact) return exact;
  // Tolerant match: legacy/seed data writes lowercase slugs ("docker"),
  // configs use "logoDocker"/"DockerOutlined" — compare normalized forms.
  const normalized = normalizeIconName(lookupName);
  const byName = icons.find((icon) => normalizeIconName(icon.name) === normalized);
  if (byName) return byName;
  // Last resort: match by display label (e.g. "kubernetes" -> label "Kubernetes").
  const label = lookupName.toLowerCase();
  return icons.find((icon) => icon.label.toLowerCase() === label);
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