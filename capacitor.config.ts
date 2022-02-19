import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "portfolio",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    url: "http://192.168.0.10:8100",
    cleartext: true,
  },
};

export default config;
