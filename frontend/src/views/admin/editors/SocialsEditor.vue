<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Redes sociales</ion-label>

      <ion-button :disabled="!allValid" @click="addSocial">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card
      v-for="(social, index) in modelValue"
      :key="index"
      class="shadow1"
    >
      <ion-item button lines="full" @click="openSelector(index)">
        <template v-if="social.iconName">
          <ion-icon
            slot="start"
            :icon="getIcon(social.iconName)"
            :style="{ color: getColor(social.iconName) }"
          ></ion-icon>
          <ion-label :style="{ color: getColor(social.iconName) }">
            {{ getPlatformName(social.iconName) }}
          </ion-label>
        </template>
        <template v-else>
          <ion-label>Seleccionar plataforma</ion-label>
        </template>
      </ion-item>

      <ion-item lines="full">
        <ion-input
          label="URL del perfil"
          label-placement="floating"
          :value="social.url"
          placeholder="https://..."
          type="url"
          :error-text="getError({ index, field: 'url' })"
          :class="{
            'ion-invalid': hasError({ index, field: 'url' }),
            'ion-touched': touched[index]?.url,
          }"
          @ion-input="
            updateSocial({ index, field: 'url', value: $event.detail.value! })
          "
          @ion-blur="touchField({ index, field: 'url' })"
        ></ion-input>
      </ion-item>

      <ion-item lines="none">
        <ion-button
          slot="end"
          fill="clear"
          color="danger"
          size="small"
          @click="removeSocial({ index })"
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
          <ion-title>Seleccionar plataforma</ion-title>
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
              :icon="getIcon(icon.name)"
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
  IonInput,
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
import { computed, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, url as urlValidator, helpers } from "@vuelidate/validators";
import {
  logoBehance,
  logoBitbucket,
  chatbox,
  logoDiscord,
  logoDribbble,
  logoFacebook,
  logoGithub,
  logoGitlab,
  logoGoogle,
  logoInstagram,
  logoLinkedin,
  logoMedium,
  logoPaypal,
  logoPinterest,
  logoReddit,
  logoSlack,
  logoSnapchat,
  logoSoundcloud,
  logoStackoverflow,
  logoSteam,
  logoTwitch,
  logoTwitter,
  logoTiktok,
  logoTumblr,
  logoVk,
  logoVimeo,
  logoWechat,
  logoWhatsapp,
  logoWordpress,
  logoX,
  logoXbox,
  logoYoutube,
  logoPlaystation,
  logoSkype,
  logoBitcoin,
} from "ionicons/icons";

export interface SocialItem {
  platform: string;
  url: string;
  iconName: string;
}

const props = defineProps<{
  modelValue: SocialItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SocialItem[]): void;
}>();

const iconMap: Record<string, string> = {
  logoBehance,
  logoBitbucket,
  chatbox,
  logoDiscord,
  logoDribbble,
  logoFacebook,
  logoGithub,
  logoGitlab,
  logoGoogle,
  logoInstagram,
  logoLinkedin,
  logoMedium,
  logoPaypal,
  logoPinterest,
  logoReddit,
  logoSlack,
  logoSnapchat,
  logoSoundcloud,
  logoStackoverflow,
  logoSteam,
  logoTwitch,
  logoTwitter,
  logoTiktok,
  logoTumblr,
  logoVk,
  logoVimeo,
  logoWechat,
  logoWhatsapp,
  logoWordpress,
  logoX,
  logoXbox,
  logoYoutube,
  logoPlaystation,
  logoSkype,
  logoBitcoin,
};

const socialIcons = [
  { name: "logoBehance", label: "Behance", color: "#1769ff" },
  { name: "logoBitbucket", label: "Bitbucket", color: "#205081" },
  { name: "logoDribbble", label: "Dribbble", color: "#ea4c89" },
  { name: "logoMedium", label: "Medium", color: "#00ab6c" },
  { name: "logoPaypal", label: "PayPal", color: "#003087" },
  { name: "logoPinterest", label: "Pinterest", color: "#bd081c" },
  { name: "logoReddit", label: "Reddit", color: "#ff4500" },
  { name: "logoSnapchat", label: "Snapchat", color: "#fffc00" },
  { name: "logoSoundcloud", label: "SoundCloud", color: "#ff5500" },
  { name: "logoSteam", label: "Steam", color: "#171a21" },
  { name: "logoTwitch", label: "Twitch", color: "#9146ff" },
  { name: "logoTumblr", label: "Tumblr", color: "#001935" },
  { name: "logoVk", label: "VK", color: "#45668e" },
  { name: "logoVimeo", label: "Vimeo", color: "#1ab7ae" },
  { name: "logoWechat", label: "WeChat", color: "#07c203" },
  { name: "logoWhatsapp", label: "WhatsApp", color: "#25d366" },
  { name: "logoXbox", label: "Xbox", color: "#107c10" },
  { name: "logoPlaystation", label: "PlayStation", color: "#003791" },
  { name: "logoSkype", label: "Skype", color: "#00aff0" },
  { name: "logoBitcoin", label: "Bitcoin", color: "#f7931a" },
  { name: "chatbox", label: "ChatBox", color: "#007acc" },
  { name: "logoLinkedin", label: "LinkedIn", color: "#0a66c2" },
  { name: "logoTwitter", label: "Twitter", color: "#1da1f2" },
  { name: "logoFacebook", label: "Facebook", color: "#1877f2" },
  { name: "logoInstagram", label: "Instagram", color: "#e4405f" },
  { name: "logoYoutube", label: "YouTube", color: "#ff0000" },
  { name: "logoTiktok", label: "TikTok", color: "#000000" },
  { name: "logoDiscord", label: "Discord", color: "#5865f2" },
  { name: "logoSlack", label: "Slack", color: "#4a154b" },
  { name: "logoWordpress", label: "WordPress", color: "#21759b" },
  { name: "logoGithub", label: "GitHub", color: "#181717" },
  { name: "logoGitlab", label: "GitLab", color: "#fc6d26" },
  { name: "logoGoogle", label: "Google", color: "#4285f4" },
  { name: "logoAmazon", label: "Amazon", color: "#ff9900" },
  { name: "logoStackoverflow", label: "Stack Overflow", color: "#f48024" },
];

const touched = reactive<Record<number, Record<string, boolean>>>({});
const showSelector = ref(false);
const searchText = ref("");
let currentIndex = 0;

const filteredIcons = computed(() => {
  if (!searchText.value) return socialIcons;
  const search = searchText.value.toLowerCase();
  return socialIcons.filter(
    (icon) =>
      icon.label.toLowerCase().includes(search) ||
      icon.name.toLowerCase().includes(search),
  );
});

const rules = {
  items: {
    $each: helpers.forEach({
      iconName: {
        required: helpers.withMessage("La plataforma es requerida", required),
      },
      url: {
        required: helpers.withMessage("La URL es requerida", required),
        url: helpers.withMessage("Debe ser una URL válida", urlValidator),
      },
    }),
  },
};

const v$ = useVuelidate(rules, { items: computed(() => props.modelValue) });

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return !v$.value.$invalid;
});

function getIcon(name: string) {
  return iconMap[name] || closeOutline;
}

function getColor(name: string) {
  const icon = socialIcons.find((i) => i.name === name);
  return icon?.color || "#666666";
}

function getPlatformName(name: string): string {
  const icon = socialIcons.find((i) => i.name === name);
  return icon?.label || name;
}

function openSelector(index: number) {
  currentIndex = index;
  selectedIcon.value = props.modelValue[index].iconName;
  showSelector.value = true;
}

const selectedIcon = ref("");

function selectIcon(name: string) {
  updateSocial({ index: currentIndex, field: "iconName", value: name });
  showSelector.value = false;
}

function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function addSocial() {
  emit("update:modelValue", [
    ...props.modelValue,
    { platform: "", url: "", iconName: "" },
  ]);
}

function updateSocial(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };

  if (field === "iconName") {
    updated[index].platform = getPlatformName(value);
  }

  emit("update:modelValue", updated);
}

function removeSocial(params: { index: number }) {
  const { index } = params;
  delete touched[index];
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}
</script>

<style scoped></style>
