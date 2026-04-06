<template>
  <form @submit.prevent="homeEditorStore.save">
    <ion-list>
      <ion-list-header>
        <ion-label>Informacion</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input
              v-model="homeEditorStore.form.name"
              placeholder="Tu nombre o título"
              required
            ></ion-input>
          </ion-item>

          <ion-item lines="none" class="ion-margin-top">
            <ion-label position="stacked">Etiquetas</ion-label>
          </ion-item>
          <div class="chips-container">
            <ion-chip
              v-for="(tag, index) in homeEditorStore.form.tags"
              :key="index"
              color="primary"
            >
              <ion-label>{{ tag }}</ion-label>
              <ion-icon
                :icon="closeOutline"
                @click="removeTag(index)"
              ></ion-icon>
            </ion-chip>
          </div>
          <ion-item>
            <ion-input
              v-model="newTag"
              placeholder="Nueva etiqueta"
              @keyup.enter="addTag"
            ></ion-input>
            <ion-button
              slot="end"
              size="small"
              :disabled="!newTag.trim()"
              @click="addTag"
            >
              Agregar
            </ion-button>
          </ion-item>

          <ion-item class="ion-margin-top">
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea
              v-model="homeEditorStore.form.description"
              :rows="4"
              placeholder="Describe quién eres o qué haces"
            ></ion-textarea>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Visual</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-card-content>
          <ion-item lines="none" class="ion-margin-top">
            <ion-label>Redes Sociales</ion-label>
            <ion-button id="social-popover-trigger" slot="end" size="small">
              <ion-icon slot="start" :icon="addOutline"></ion-icon>
              Añadir
            </ion-button>
          </ion-item>

          <div
            v-for="(social, index) in homeEditorStore.form.socials"
            :key="index"
            class="social-row"
          >
            <ion-item>
              <ion-icon
                v-if="social.platform"
                slot="start"
                :icon="getIconByName(social.platform)"
              ></ion-icon>
              <ion-input
                v-model="social.platform"
                placeholder="Plataforma"
                readonly
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="social.url"
                placeholder="https://..."
                type="url"
              ></ion-input>
            </ion-item>
            <ion-button
              fill="clear"
              color="danger"
              @click="removeSocial(index)"
            >
              <ion-icon :icon="trashOutline"></ion-icon>
            </ion-button>
          </div>

          <ion-item class="ion-margin-top">
            <ion-label position="stacked">Logo</ion-label>
            <input
              type="file"
              accept="image/*"
              class="ion-margin-top"
              @change="onFileChange($event, 'logo')"
            />
            <img
              v-if="homeEditorStore.preview.logo"
              :src="homeEditorStore.preview.logo"
              alt="Logo preview"
              class="image-preview"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Foto (Cover)</ion-label>
            <input
              type="file"
              accept="image/*"
              class="ion-margin-top"
              @change="onFileChange($event, 'photo')"
            />
            <img
              v-if="homeEditorStore.preview.photo"
              :src="homeEditorStore.preview.photo"
              alt="Foto preview"
              class="image-preview"
            />
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Otras opciones</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-card-content>
          <ion-item class="ion-margin-top">
            <ion-label>Mostrar formulario de contacto</ion-label>
            <ion-toggle
              :checked="homeEditorStore.form.showContactForm"
              @ion-change="
                homeEditorStore.form.showContactForm = $event.detail.checked
              "
            ></ion-toggle>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-list>
  </form>

  <!-- popovers -->
  <ion-popover trigger="social-popover-trigger" :dismiss-on-select="true">
    <ion-content>
      <ion-list>
        <ion-item
          v-for="social in filteredSocials"
          :key="social.name"
          button
          @click="addSocial(social.name)"
        >
          <ion-icon
            slot="start"
            :icon="getIconByName(social.iconName)"
          ></ion-icon>
          <ion-label>{{ social.name }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
  <!-- end popovers -->
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonChip,
  IonIcon,
  IonPopover,
  IonList,
  IonContent,
  IonToggle,
} from "@ionic/vue";
import { ref, computed } from "vue";
import {
  addOutline,
  closeOutline,
  trashOutline,
  linkOutline,
} from "ionicons/icons";
import * as ionicons from "ionicons/icons";
import { useHomeEditorStore } from "@/store/homeEditorStore";

const homeEditorStore = useHomeEditorStore();
const newTag = ref("");

const availableSocials = [
  { name: "Facebook", iconName: "logoFacebook" },
  { name: "X", iconName: "logoX" },
  { name: "Twitter", iconName: "logoTwitter" },
  { name: "Instagram", iconName: "logoInstagram" },
  { name: "LinkedIn", iconName: "logoLinkedin" },
  { name: "YouTube", iconName: "logoYoutube" },
  { name: "TikTok", iconName: "logoTiktok" },
  { name: "GitHub", iconName: "logoGithub" },
  { name: "Discord", iconName: "logoDiscord" },
  { name: "Twitch", iconName: "logoTwitch" },
  { name: "Pinterest", iconName: "logoPinterest" },
  { name: "Snapchat", iconName: "logoSnapchat" },
  { name: "Reddit", iconName: "logoReddit" },
  { name: "WhatsApp", iconName: "logoWhatsapp" },
  { name: "WeChat", iconName: "logoWechat" },
  { name: "Skype", iconName: "logoSkype" },
  { name: "Slack", iconName: "logoSlack" },
  { name: "Dribbble", iconName: "logoDribbble" },
  { name: "Behance", iconName: "logoBehance" },
  { name: "Medium", iconName: "logoMedium" },
  { name: "WordPress", iconName: "logoWordpress" },
  { name: "Vimeo", iconName: "logoVimeo" },
  { name: "SoundCloud", iconName: "logoSoundcloud" },
  { name: "Apple", iconName: "logoApple" },
  { name: "Google", iconName: "logoGoogle" },
  { name: "Amazon", iconName: "logoAmazon" },
  { name: "PayPal", iconName: "logoPaypal" },
  { name: "Bitcoin", iconName: "logoBitcoin" },
  { name: "Stack Overflow", iconName: "logoStackoverflow" },
  { name: "Steam", iconName: "logoSteam" },
  { name: "Xbox", iconName: "logoXbox" },
  { name: "PlayStation", iconName: "logoPlaystation" },
  { name: "Tumblr", iconName: "logoTumblr" },
  { name: "VK", iconName: "logoVk" },
];

function getIconByName(iconName: string) {
  if (!iconName) return linkOutline;

  let icon = ionicons[iconName as keyof typeof ionicons];
  if (icon) return icon;

  const logoIconName = `logo${iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/\s/g, "")}`;
  icon = ionicons[logoIconName as keyof typeof ionicons];
  if (icon) return icon;

  const social = availableSocials.find(
    (s) => s.name.toLowerCase() === iconName.toLowerCase(),
  );
  if (social) {
    icon = ionicons[social.iconName as keyof typeof ionicons];
    if (icon) return icon;
  }

  return linkOutline;
}

const filteredSocials = computed(() => {
  const selectedPlatforms = homeEditorStore.form.socials
    .filter((s) => s.platform)
    .map((s) => s.platform.toLowerCase());
  return availableSocials.filter(
    (social) => !selectedPlatforms.includes(social.name.toLowerCase()),
  );
});

function addTag() {
  if (!newTag.value.trim()) return;
  if (!homeEditorStore.form.tags.includes(newTag.value.trim())) {
    homeEditorStore.form.tags.push(newTag.value.trim());
  }
  newTag.value = "";
}

function removeTag(index: number) {
  homeEditorStore.form.tags.splice(index, 1);
}

function addSocial(platform: string) {
  const social = availableSocials.find((s) => s.name === platform);
  const iconName = social ? social.iconName : "";
  homeEditorStore.form.socials.push({ platform, url: "", iconName });
}

function removeSocial(index: number) {
  homeEditorStore.form.socials.splice(index, 1);
}

function onFileChange(event: Event, type: "logo" | "photo") {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  homeEditorStore.files[type] = file;
  homeEditorStore.preview[type] = URL.createObjectURL(file);
}

function fillTestData() {
  homeEditorStore.form.name = "Juan Pérez";
  homeEditorStore.form.tags = [
    "Desarrollador",
    "Full-Stack",
    "Vue.js",
    "Laravel",
  ];
  homeEditorStore.form.description =
    "Desarrollador Full-Stack con más de 5 años de experiencia en el desarrollo de aplicaciones web y móviles. Especializado en Vue.js, Laravel y bases de datos relacionales.";
  homeEditorStore.form.socials = [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/juanperez",
      iconName: "logoLinkedin",
    },
    {
      platform: "GitHub",
      url: "https://github.com/juanperez",
      iconName: "logoGithub",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/juanperez",
      iconName: "logoTwitter",
    },
  ];
}

defineExpose({ fillTestData });
</script>

<style scoped>
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.social-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.social-row ion-item {
  flex: 1;
}
.image-preview {
  max-width: 100%;
  max-height: 120px;
  margin-top: 12px;
  border-radius: 8px;
}
input[type="file"] {
  margin-top: 8px;
}
</style>
