import { describe, it, expect, vi } from "vitest";
import { getIconByName, getIonIconSvg, getLineIconComponent, isLineIcon } from "@/utils/iconsIndex";

// The real configs import icon components from @lineiconshq/vue-lineicons and
// ionicons; the free-icons package breaks vitest's ESM transform. Mock both
// configs with realistic shape mirroring the real names (PascalCase "logo*"
// ionicons, "…Outlined" lineicons) so the lookup normalization is tested
// against the same naming worlds the seed controller writes.
vi.mock("@/config/iconConfig", () => ({
  allIcons: [
    { name: "logoVue", label: "Vue.js", color: "#41b883", type: "tech", icon: "svg:vue" },
    { name: "logoReact", label: "React", color: "#61dafb", type: "tech", icon: "svg:react" },
    { name: "logoLaravel", label: "Laravel", color: "#ff2d20", type: "tech", icon: "svg:laravel" },
    { name: "logoDocker", label: "Docker", color: "#2496ed", type: "tech", icon: "svg:docker" },
    { name: "logoPython", label: "Python", color: "#3776ab", type: "tech", icon: "svg:python" },
  ],
}));

vi.mock("@/config/lineiconsConfig", () => ({
  allLineIcons: [
    { name: "TypescriptOutlined", label: "TypeScript", color: "#3178c6", type: "tech", icon: "cmp:ts" },
    { name: "ReactOutlined", label: "React", color: "#61dafb", type: "tech", icon: "cmp:react" },
    { name: "VuejsOutlined", label: "Vue.js", color: "#4fc08d", type: "tech", icon: "cmp:vue" },
    { name: "PythonOutlined", label: "Python", color: "#3776ab", type: "tech", icon: "cmp:python" },
    { name: "LaravelOutlined", label: "Laravel", color: "#ff2d20", type: "tech", icon: "cmp:laravel" },
    { name: "DockerOutlined", label: "Docker", color: "#2496ed", type: "tech", icon: "cmp:docker" },
    { name: "KubernetesOutlined", label: "Kubernetes", color: "#326ce5", type: "tech", icon: "cmp:k8s" },
    { name: "GoOutlined", label: "Go", color: "#00add8", type: "tech", icon: "cmp:go" },
    { name: "NodejsOutlined", label: "Node.js", color: "#339933", type: "tech", icon: "cmp:node" },
  ],
}));

/**
 * Seed data writes lowercase slugs ("docker", "laravel") while the icon
 * configs use PascalCase component names ("DockerOutlined") or "logo*"
 * prefixes ("logoDocker"). The lookup must resolve both so legacy data
 * still renders icons.
 */
describe("iconsIndex lookup normalization", () => {
  it("resolves exact PascalCase names (unchanged fast path)", () => {
    expect(getIconByName("DockerOutlined")?.label).toBe("Docker");
    expect(getIconByName("logoVue")?.label).toBe("Vue.js");
  });

  it("resolves lowercase tech slugs used by the seed controller", () => {
    expect(getIconByName("docker")?.name).toBeTruthy();
    expect(getIconByName("laravel")?.name).toBeTruthy();
    expect(getIconByName("react")?.name).toBeTruthy();
    expect(getIconByName("python")?.name).toBeTruthy();
    expect(getIconByName("typescript")?.name).toBeTruthy();
    expect(getIconByName("kubernetes")?.name).toBeTruthy();
    expect(getIconByName("go")?.name).toBeTruthy();
  });

  it("resolves lowercase slug 'node' via explicit alias to NodejsOutlined", () => {
    const icon = getIconByName("node");
    expect(icon?.name).toBe("NodejsOutlined");
    expect(icon?.source).toBe("lineicons");
  });

  it("documents catalog gap: seed writes 'rust' but no icon exists in any library", () => {
    // The seed controller writes TECH_NAMES slugs; no Rust icon exists in
    // free-icons or ionicons, so there is no catalog entry to resolve. This
    // is a catalog gap, not a lookup bug.
    expect(getIconByName("rust")).toBeUndefined();
  });

  it("resolves lowercase slug 'vue' to a real icon", () => {
    const icon = getIconByName("vue");
    expect(icon?.name).toBeTruthy();
    expect(icon?.source).toBeTruthy();
  });

  it("renders an svg or component for seed-style slugs", () => {
    expect(getIonIconSvg("docker") || getLineIconComponent("docker")).toBeTruthy();
    expect(getIonIconSvg("react") || getLineIconComponent("react")).toBeTruthy();
  });

  it("classifies seed-style slugs consistently with the resolved icon", () => {
    const icon = getIconByName("docker");
    if (icon?.source === "lineicons") {
      expect(isLineIcon("docker")).toBe(true);
      expect(getLineIconComponent("docker")).toBeTruthy();
    } else {
      expect(isLineIcon("docker")).toBe(false);
      expect(getIonIconSvg("docker")).toBeTruthy();
    }
  });

  it("keeps returning undefined for unknown names", () => {
    expect(getIconByName("no-such-icon")).toBeUndefined();
  });
});
