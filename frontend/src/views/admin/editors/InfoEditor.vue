<template>
  <form @submit.prevent="homeEditorStore.save">
    <ion-list>
      <ion-list-header>
        <ion-label>Información</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-item lines="full">
          <ion-label position="stacked">Nombre</ion-label>
          <ion-input
            v-model="homeEditorStore.form.name"
            placeholder="Tu nombre o título"
            required
          ></ion-input>
        </ion-item>

        <ion-item lines="full">
          <ion-label position="stacked">Descripción</ion-label>
          <ion-textarea
            v-model="homeEditorStore.form.description"
            :rows="4"
            placeholder="Describe quién eres o qué haces"
          ></ion-textarea>
        </ion-item>
      </ion-card>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Etiquetas</ion-label>

        <ion-button @click="isAddTagAlertOpen = true">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Agregar
        </ion-button>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-card-content>
          <div class="chips-container">
            <ion-chip
              v-for="(tag, index) in homeEditorStore.form.tags"
              :key="index"
              color="primary"
            >
              <ion-label>{{ tag }}</ion-label>
              <ion-icon
                :icon="closeOutline"
                @click="removeTag({ index })"
              ></ion-icon>
            </ion-chip>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Redes sociales</ion-label>

        <ion-button id="social-popover-trigger">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Añadir
        </ion-button>
      </ion-list-header>

      <ion-card class="shadow1">
        <template
          v-for="(social, index) in homeEditorStore.form.socials"
          :key="index"
        >
          <ion-item lines="full">
            <ion-icon
              v-if="social.platform"
              slot="start"
              :icon="getIconByName(social.platform)"
            ></ion-icon>
            <ion-label>{{ social.platform || "Plataforma" }}</ion-label>

            <ion-input
              slot="end"
              v-model="social.url"
              placeholder="https://..."
              type="url"
            ></ion-input>

            <ion-button
              slot="end"
              fill="clear"
              color="danger"
              @click="removeSocial({ index })"
            >
              <ion-icon :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-item>
        </template>
      </ion-card>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Visual</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <section>
          <ion-item lines="full" button @click="openFileDialog({ type: 'logo' })">
            <ion-label>Logo</ion-label>

            <ion-note v-if="fileNames.logo" slot="end">{{
              fileNames.logo
            }}</ion-note>
            <ion-note v-else slot="end">Seleccionar</ion-note>

            <ion-button
              slot="end"
              fill="clear"
              :disabled="!homeEditorStore.preview.logo"
              @click.stop="showPreview({ type: 'logo' })"
            >
              <ion-icon :icon="eyeOutline"></ion-icon>
            </ion-button>
          </ion-item>

          <input
            style="display: none"
            data-type="logo"
            type="file"
            accept="image/*"
            @change="onFileChange({ event: $event, type: 'logo' })"
          />
        </section>

        <section>
          <ion-item lines="full" button @click="openFileDialog({ type: 'photo' })">
            <ion-label>Foto (Cover)</ion-label>

            <ion-note v-if="fileNames.photo" slot="end">{{
              fileNames.photo
            }}</ion-note>

            <ion-note v-else slot="end">Seleccionar</ion-note>

            <ion-button
              slot="end"
              fill="clear"
              :disabled="!homeEditorStore.preview.photo"
              @click.stop="showPreview({ type: 'photo' })"
            >
              <ion-icon :icon="eyeOutline"></ion-icon>
            </ion-button>
          </ion-item>

          <input
            style="display: none"
            data-type="photo"
            type="file"
            accept="image/*"
            @change="onFileChange({ event: $event, type: 'photo' })"
          />
        </section>
      </ion-card>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Otras opciones</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-item>
          <ion-label>Mostrar formulario de contacto</ion-label>

          <ion-toggle
            slot="end"
            :checked="homeEditorStore.form.showContactForm"
            @ion-change="
              homeEditorStore.form.showContactForm = $event.detail.checked
            "
          ></ion-toggle>
        </ion-item>
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
          @click="addSocial({ platform: social.name })"
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

  <ion-modal :is-open="isPreviewOpen" @ion-modal-did-dismiss="closePreview">
    <ion-header>
      <ion-toolbar>
        <ion-title>Vista previa</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closePreview">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div style="padding: 16px; text-align: center">
      <img
        v-if="previewSrc"
        :src="previewSrc"
        alt="preview"
        class="modal-image"
      />
    </div>
  </ion-modal>

  <!-- alerts -->
  <ion-alert
    :is-open="isAddTagAlertOpen"
    header="Agregar etiqueta"
    :inputs="alertInputs"
    :buttons="alertButtons"
    @did-dismiss="
      () => {
        isAddTagAlertOpen = false;
      }
    "
  />
  <!-- end alerts -->
</template>

<script setup lang="ts">
// imports
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
  IonAlert,
  IonButton,
  IonNote,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from "@ionic/vue";
import { ref, computed, reactive } from "vue";
import {
  addOutline,
  closeOutline,
  trashOutline,
  linkOutline,
  eyeOutline,
} from "ionicons/icons";
import * as ionicons from "ionicons/icons";
import { useHomeEditorStore } from "@/store/homeEditorStore";
// end imports

// vars and const
const homeEditorStore = useHomeEditorStore();
const isAddTagAlertOpen = ref(false);

const fileNames = reactive<Record<string, string>>({});

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);
// end vars and const

// alert inputs
const alertInputs = [
  {
    name: "tag",
    type: "text",
    placeholder: "Nueva etiqueta",
  },
];

function handleAddTagFromAlert(data: Record<string, string> | undefined) {
  const tag = data && data.tag ? String(data.tag).trim() : "";
  if (!tag) return false;
  if (!homeEditorStore.form.tags.includes(tag)) {
    homeEditorStore.form.tags.push(tag);
  }
  return true;
}

const alertButtons = [
  { text: "Cancelar", role: "cancel" },
  {
    text: "Agregar",
    handler: (data: Record<string, string> | undefined) =>
      handleAddTagFromAlert(data),
  },
];
// end alert inputs

// available socials
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
// end available socials

// computed
const filteredSocials = computed(() => {
  const selectedPlatforms = homeEditorStore.form.socials
    .filter((s) => s.platform)
    .map((s) => s.platform.toLowerCase());
  return availableSocials.filter(
    (social) => !selectedPlatforms.includes(social.name.toLowerCase()),
  );
});
// end computed

// functions
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

function removeTag(params: { index: number }) {
  const { index } = params;
  homeEditorStore.form.tags.splice(index, 1);
}

function addSocial(params: { platform: string }) {
  const { platform } = params;
  const social = availableSocials.find((s) => s.name === platform);
  const iconName = social ? social.iconName : "";
  homeEditorStore.form.socials.push({ platform, url: "", iconName });
}

function removeSocial(params: { index: number }) {
  const { index } = params;
  homeEditorStore.form.socials.splice(index, 1);
}

function onFileChange(params: { event: Event; type: "logo" | "photo" }) {
  const { event, type } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  homeEditorStore.files[type] = file;
  homeEditorStore.preview[type] = URL.createObjectURL(file);
  fileNames[type] = file.name;
}

function openFileDialog(params: { type: "logo" | "photo" }) {
  const { type } = params;
  const selector = `input[data-type="${type}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showPreview(params: { type: "logo" | "photo" }) {
  const { type } = params;
  const src = homeEditorStore.preview[type] ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
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
// end functions
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

.modal-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>
