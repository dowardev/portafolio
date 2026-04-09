<template>
  <ion-button fill="clear" @click="openModal = true">
    <template v-if="modelValue">
      <ion-icon
        :icon="getIcon(modelValue)"
        :style="{ color: getColor(modelValue), marginRight: '8px' }"
      ></ion-icon>
      {{ getLabel(modelValue) }}
    </template>
    <template v-else> Seleccionar icono </template>
  </ion-button>

  <ion-modal :is-open="openModal" @did-dismiss="openModal = false">
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="openModal = false">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Seleccionar icono</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="searchText"
          placeholder="Buscar..."
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item
          button
          :color="!modelValue ? 'light' : ''"
          @click="selectIcon('')"
        >
          <ion-label>Ninguno</ion-label>
        </ion-item>
        <ion-item
          v-for="icon in filteredIcons"
          :key="icon.name"
          button
          :color="modelValue === icon.name ? 'light' : ''"
          @click="selectIcon(icon.name)"
        >
          <ion-icon
            slot="start"
            :icon="getIcon(icon.name)"
            :style="{ color: icon.color, fontSize: '24px' }"
          ></ion-icon>
          <ion-label>{{ icon.label }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonSearchbar,
} from "@ionic/vue";
import { ref, computed } from "vue";
import {
  closeOutline,
  helpCircleOutline,
  compassOutline,
  logoVue,
  logoReact,
  logoAngular,
  logoNodejs,
  logoPython,
  logoJavascript,
  logoHtml5,
  logoCss3,
  logoSass,
  logoLaravel,
  logoIonic,
  logoFirebase,
  logoGithub,
  logoGitlab,
  logoNpm,
  logoDocker,
  logoAndroid,
  logoApple,
  logoWindows,
  logoTux,
  logoGoogle,
  logoLinkedin,
  logoTwitter,
  logoFacebook,
  logoInstagram,
  logoYoutube,
  logoTiktok,
  logoDiscord,
  logoSlack,
  logoWordpress,
  logoStackoverflow,
  logoChrome,
  logoFirefox,
  logoEdge,
  logoMicrosoft,
  logoAmazon,
  logoCapacitor,
  logoElectron,
  codeSlashOutline,
  serverOutline,
  cloudOutline,
  terminalOutline,
  gitBranchOutline,
  hardwareChipOutline,
} from "ionicons/icons";

defineProps<{
  modelValue: string;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const openModal = ref(false);
const searchText = ref("");

const iconMap: Record<string, string> = {
  logoVue,
  logoReact,
  logoAngular,
  logoNodejs,
  logoPython,
  logoJavascript,
  logoHtml5,
  logoCss3,
  logoSass,
  logoLaravel,
  logoIonic,
  logoFirebase,
  logoGithub,
  logoGitlab,
  logoNpm,
  logoDocker,
  logoAndroid,
  logoApple,
  logoWindows,
  logoTux,
  logoGoogle,
  logoLinkedin,
  logoTwitter,
  logoFacebook,
  logoInstagram,
  logoYoutube,
  logoTiktok,
  logoDiscord,
  logoSlack,
  logoWordpress,
  logoStackoverflow,
  logoChrome,
  logoFirefox,
  logoEdge,
  compassOutline,
  logoMicrosoft,
  logoAmazon,
  logoCapacitor,
  logoElectron,
  codeSlashOutline,
  serverOutline,
  cloudOutline,
  terminalOutline,
  gitBranchOutline,
  hardwareChipOutline,
};

const techIcons = [
  { name: "logoVue", label: "Vue.js", color: "#41b883" },
  { name: "logoReact", label: "React", color: "#61dafb" },
  { name: "logoAngular", label: "Angular", color: "#dd0031" },
  { name: "logoNodejs", label: "Node.js", color: "#339933" },
  { name: "logoPython", label: "Python", color: "#3776ab" },
  { name: "logoJavascript", label: "JavaScript", color: "#f7df1e" },
  { name: "logoHtml5", label: "HTML5", color: "#e34f26" },
  { name: "logoCss3", label: "CSS3", color: "#1572b6" },
  { name: "logoSass", label: "Sass", color: "#cc6699" },
  { name: "logoLaravel", label: "Laravel", color: "#ff2d20" },
  { name: "logoIonic", label: "Ionic", color: "#3880ff" },
  { name: "logoFirebase", label: "Firebase", color: "#ffca28" },
  { name: "logoGithub", label: "GitHub", color: "#181717" },
  { name: "logoGitlab", label: "GitLab", color: "#fc6d26" },
  { name: "logoNpm", label: "NPM", color: "#cb3837" },
  { name: "logoDocker", label: "Docker", color: "#2496ed" },
  { name: "logoAndroid", label: "Android", color: "#3ddc84" },
  { name: "logoApple", label: "Apple", color: "#000000" },
  { name: "logoWindows", label: "Windows", color: "#0078d4" },
  { name: "logoTux", label: "Linux", color: "#fcc624" },
  { name: "logoGoogle", label: "Google", color: "#4285f4" },
  { name: "logoLinkedin", label: "LinkedIn", color: "#0a66c2" },
  { name: "logoTwitter", label: "Twitter", color: "#1da1f2" },
  { name: "logoFacebook", label: "Facebook", color: "#1877f2" },
  { name: "logoInstagram", label: "Instagram", color: "#e4405f" },
  { name: "logoYoutube", label: "YouTube", color: "#ff0000" },
  { name: "logoTiktok", label: "TikTok", color: "#000000" },
  { name: "logoDiscord", label: "Discord", color: "#5865f2" },
  { name: "logoSlack", label: "Slack", color: "#4a154b" },
  { name: "logoWordpress", label: "WordPress", color: "#21759b" },
  { name: "codeSlashOutline", label: "PHP", color: "#777bb4" },
  { name: "logoStackoverflow", label: "Stack Overflow", color: "#f48024" },
  { name: "logoChrome", label: "Chrome", color: "#4285f4" },
  { name: "logoFirefox", label: "Firefox", color: "#ff7139" },
  { name: "logoEdge", label: "Edge", color: "#0078d4" },
  { name: "compassOutline", label: "Safari", color: "#006cff" },
  { name: "logoMicrosoft", label: "Microsoft", color: "#0078d4" },
  { name: "logoAmazon", label: "Amazon/AWS", color: "#ff9900" },
  { name: "logoCapacitor", label: "Capacitor", color: "#119eff" },
  { name: "codeSlashOutline", label: "Código", color: "#666" },
  { name: "serverOutline", label: "Servidor", color: "#666" },
  { name: "cloudOutline", label: "Cloud", color: "#666" },
  { name: "serverOutline", label: "Base de datos", color: "#666" },
  { name: "terminalOutline", label: "Terminal", color: "#666" },
  { name: "gitBranchOutline", label: "Git", color: "#666" },
  { name: "hardwareChipOutline", label: "Hardware", color: "#666" },
  { name: "logoElectron", label: "Electron", color: "#47848f" },
  { name: "logoVue", label: "Nuxt", color: "#00dc82" },
  { name: "logoJavascript", label: "TypeScript", color: "#3178c6" },
];

const filteredIcons = computed(() => {
  if (!searchText.value) return techIcons;
  const search = searchText.value.toLowerCase();
  return techIcons.filter(
    (icon) =>
      icon.label.toLowerCase().includes(search) ||
      icon.name.toLowerCase().includes(search),
  );
});

function getIcon(name: string) {
  return iconMap[name] || helpCircleOutline;
}

function getColor(name: string) {
  const icon = techIcons.find((i) => i.name === name);
  return icon?.color || "#666666";
}

function getLabel(name: string) {
  const icon = techIcons.find((i) => i.name === name);
  return icon?.label || name;
}

function selectIcon(name: string) {
  emit("update:modelValue", name);
  openModal.value = false;
}
</script>

<style scoped>
.select-button {
  width: 100%;
  margin-top: 8px;
}
</style>
