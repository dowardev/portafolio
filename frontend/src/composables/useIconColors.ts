const iconColors: Record<string, string> = {
  logoVue: "#41b883",
  logoReact: "#61dafb",
  logoAngular: "#dd0031",
  logoNodejs: "#339933",
  logoPython: "#3776ab",
  logoJavascript: "#f7df1e",
  logoHtml5: "#e34f26",
  logoCss3: "#1572b6",
  logoSass: "#cc6699",
  logoLaravel: "#ff2d20",
  logoIonic: "#3880ff",
  logoFirebase: "#ffca28",
  logoGithub: "#181717",
  logoGitlab: "#fc6d26",
  logoNpm: "#cb3837",
  logoDocker: "#2496ed",
  logoAndroid: "#3ddc84",
  logoApple: "#000000",
  logoWindows: "#0078d4",
  logoTux: "#fcc624",
  logoGoogle: "#4285f4",
  logoLinkedin: "#0a66c2",
  logoTwitter: "#1da1f2",
  logoFacebook: "#1877f2",
  logoInstagram: "#e4405f",
  logoYoutube: "#ff0000",
  logoTiktok: "#000000",
  logoDiscord: "#5865f2",
  logoSlack: "#4a154b",
  logoWordpress: "#21759b",
  codeSlashOutline: "#777bb4",
  logoStackoverflow: "#f48024",
  logoChrome: "#4285f4",
  logoFirefox: "#ff7139",
  logoEdge: "#0078d4",
  compassOutline: "#006cff",
  logoMicrosoft: "#0078d4",
  logoAmazon: "#ff9900",
  logoCapacitor: "#119eff",
  logoElectron: "#47848f",
  serverOutline: "#666666",
  cloudOutline: "#666666",
  terminalOutline: "#666666",
  gitBranchOutline: "#f05032",
  hardwareChipOutline: "#666666",
  helpCircleOutline: "#666666",
  linkOutline: "#666666",
};

const defaultColor = "#888888";

export function useIconColors() {
  const getIconColor = (source: string): string => {
    if (!source) return defaultColor;
    return iconColors[source] || defaultColor;
  };

  return { getIconColor };
}