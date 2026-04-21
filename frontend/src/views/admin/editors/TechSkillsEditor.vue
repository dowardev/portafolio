<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Tecnologías</ion-label>

      <ion-button @click="addTech">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card
      v-for="(tech, index) in modelValue"
      :key="index"
      class="shadow1"
    >
      <ion-item button lines="full" @click="openSelector(index)">
        <template v-if="tech.iconName">
          <ion-icon
            slot="start"
            :icon="iconMap[tech.iconName]"
            :style="{ color: getColor(tech.iconName) }"
          ></ion-icon>
          <ion-label :style="{ color: getColor(tech.iconName) }">
            {{ getLabel(tech.iconName) }}
          </ion-label>
        </template>
        <template v-else>
          <ion-label>Seleccionar tecnología</ion-label>
        </template>
      </ion-item>

      <ion-item lines="none">
        <ion-button
          slot="end"
          fill="clear"
          color="danger"
          size="small"
          @click="removeTech({ index })"
        >
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Eliminar
        </ion-button>
      </ion-item>
    </ion-card>

    <ion-modal :is-open="showSelector" @did-dismiss="showSelector = false">
      <ion-header class="ion-no-border" mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="showSelector = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Seleccionar tecnología</ion-title>
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
            :color="!selectedIcon ? 'light' : ''"
            @click="selectIcon('')"
          >
            <ion-label>Ninguno</ion-label>
          </ion-item>
          <ion-item
            v-for="icon in filteredIcons"
            :key="icon.name"
            button
            :color="selectedIcon === icon.name ? 'light' : ''"
            @click="selectIcon(icon.name)"
          >
            <ion-icon
              slot="start"
              :icon="iconMap[icon.name]"
              :style="{ color: icon.color, fontSize: '24px' }"
            ></ion-icon>
            <ion-label>{{ icon.label }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonCard,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonSearchbar,
} from "@ionic/vue";
import { addOutline, trashOutline, closeOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import {
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
} from "ionicons/icons";

export interface TechItem {
  iconName: string;
}

const props = defineProps<{
  modelValue: TechItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TechItem[]): void;
}>();

const iconMap: Record<string, any> = {
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
  { name: "logoElectron", label: "Electron", color: "#47848f" },
  { name: "terminalOutline", label: "Terminal", color: "#666666" },
  { name: "gitBranchOutline", label: "Git", color: "#666666" },
  { name: "serverOutline", label: "Servidor", color: "#666666" },
  { name: "cloudOutline", label: "Cloud", color: "#666666" },
  { name: "hardwareChipOutline", label: "Hardware", color: "#666666" },
];

const showSelector = ref(false);
const searchText = ref("");
let currentIndex = 0;

const filteredIcons = computed(() => {
  if (!searchText.value) return techIcons;
  const search = searchText.value.toLowerCase();
  return techIcons.filter(
    (icon) =>
      icon.label.toLowerCase().includes(search) ||
      icon.name.toLowerCase().includes(search),
  );
});

function getColor(name: string): string {
  const icon = techIcons.find((i) => i.name === name);
  return icon?.color || "#666666";
}

function getLabel(name: string): string {
  const icon = techIcons.find((i) => i.name === name);
  return icon?.label || name;
}

function openSelector(index: number) {
  currentIndex = index;
  selectedIcon.value = props.modelValue[index].iconName;
  showSelector.value = true;
}

const selectedIcon = ref("");

function selectIcon(name: string) {
  updateTech({ index: currentIndex, field: "iconName", value: name });
  showSelector.value = false;
}

function addTech() {
  emit("update:modelValue", [
    ...props.modelValue,
    { iconName: "" },
  ]);
}

function updateTech(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function removeTech(params: { index: number }) {
  const { index } = params;
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}
</script>

<style scoped></style>