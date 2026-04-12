<template>
  <form @submit.prevent="handleSubmit">
    <ion-list>
      <ion-list-header>
        <ion-label>Información</ion-label>
      </ion-list-header>

      <ion-card class="shadow1">
        <ion-item lines="full">
          <ion-label position="stacked">Nombre</ion-label>
          <ion-input
            v-model="form.name"
            placeholder="Tu nombre o título"
            :error-text="v$.form.name.$errors[0]?.$message.toString()"
            :class="{
              'ion-invalid': v$.form.name.$invalid && v$.form.name.$dirty,
              'ion-touched': v$.form.name.$dirty,
            }"
            @ion-blur="v$.form.name.$touch()"
          ></ion-input>
        </ion-item>

        <ion-item lines="full">
          <ion-label position="stacked">Descripción</ion-label>
          <ion-textarea
            v-model="form.description"
            :rows="4"
            placeholder="Describe quién eres o qué haces"
            :error-text="v$.form.description.$errors[0]?.$message.toString()"
            :class="{
              'ion-invalid': v$.form.description.$invalid && v$.form.description.$dirty,
              'ion-touched': v$.form.description.$dirty,
            }"
            @ion-blur="v$.form.description.$touch()"
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

        <ion-button @click="isSocialModalOpen = true">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Añadir
        </ion-button>
      </ion-list-header>

      <ion-card class="shadow1">
        <template
          v-for="(social, index) in form.socials"
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
              :error-text="v$.form.socials.$each.$response?.$errors[index]?.url?.[0]?.$message?.toString()"
              :class="{
                'ion-invalid': v$.form.socials.$each.$response?.$errors[index]?.url?.length,
                'ion-touched': v$.form.socials.$dirty,
              }"
              @ion-blur="v$.form.socials.$touch()"
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
          <ion-item
            lines="full"
            button
            @click="openFileDialog({ type: 'logo' })"
          >
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
          <ion-item
            lines="full"
            button
            @click="openFileDialog({ type: 'photo' })"
          >
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
          <ion-label>Mostrar botón de contacto (sección info)</ion-label>
          <ion-note slot="end">Junto a redes sociales</ion-note>

          <ion-toggle
            slot="end"
            :checked="homeEditorStore.form.showContactForm.socials"
            @ion-change="
              homeEditorStore.form.showContactForm.socials = $event.detail.checked
            "
          ></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>Mostrar botón de contacto (freelance)</ion-label>
          <ion-note slot="end">En sección de plataformas</ion-note>

          <ion-toggle
            slot="end"
            :checked="homeEditorStore.form.showContactForm.freelance"
            @ion-change="
              homeEditorStore.form.showContactForm.freelance = $event.detail.checked
            "
          ></ion-toggle>
        </ion-item>
      </ion-card>
    </ion-list>
  </form>

  <!-- modals -->
  <!-- social selector modal -->
  <ion-modal
    :is-open="isSocialModalOpen"
    @ion-modal-did-dismiss="closeSocialModal"
  >
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeSocialModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Agregar red social</ion-title>
      </ion-toolbar>

      <ion-toolbar>
        <ion-searchbar
          v-model="socialSearch"
          mode="ios"
          placeholder="Buscar plataforma"
          :debounce="300"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item
          v-for="social in displayedSocials"
          :key="social.name"
          button
          lines="full"
          @click="selectSocial(social.name)"
        >
          <ion-icon
            slot="start"
            :icon="getIconByName(social.iconName)"
          ></ion-icon>
          <ion-label>{{ social.name }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
  <!-- end social selector modal -->

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
  <!-- modals -->

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
  IonSearchbar,
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
import { ref, computed, reactive, watch } from "vue";
import {
  addOutline,
  closeOutline,
  trashOutline,
  linkOutline,
  eyeOutline,
} from "ionicons/icons";
import * as ionicons from "ionicons/icons";
import { useHomeEditorStore } from "@/store/homeEditorStore";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, helpers, url as urlValidator } from "@vuelidate/validators";
// end imports

// vars and const
const homeEditorStore = useHomeEditorStore();
const isAddTagAlertOpen = ref(false);

// social modal state and search
const isSocialModalOpen = ref(false);
const socialSearch = ref("");

const fileNames = reactive<Record<string, string>>({});

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);
// end vars and const

// validation
const form = ref({
  name: "",
  description: "",
  socials: [] as Array<{ platform: string; url: string; iconName: string }>,
});

// sync store → local form (when data loads from server)
watch(
  () => homeEditorStore.form.name,
  (val) => { form.value.name = val; },
  { immediate: true },
);
watch(
  () => homeEditorStore.form.description,
  (val) => { form.value.description = val; },
  { immediate: true },
);
watch(
  () => homeEditorStore.form.socials,
  (val) => { form.value.socials = val; },
  { immediate: true },
);

// sync local form → store (primitives only, on change)
watch(
  () => form.value.name,
  (val) => { homeEditorStore.form.name = val; },
);
watch(
  () => form.value.description,
  (val) => { homeEditorStore.form.description = val; },
);

const alphaName = helpers.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/);

const rules = {
  form: {
    name: {
      required: helpers.withMessage("El nombre es requerido", required),
      minLength: helpers.withMessage("El nombre debe tener al menos 2 caracteres", minLength(2)),
      maxLength: helpers.withMessage("El nombre no puede exceder 50 caracteres", maxLength(50)),
      alphaName: helpers.withMessage("El nombre solo puede contener letras, espacios y guiones", alphaName),
    },
    description: {
      required: helpers.withMessage("La descripción es requerida", required),
      minLength: helpers.withMessage("La descripción debe tener al menos 10 caracteres", minLength(10)),
      maxLength: helpers.withMessage("La descripción no puede exceder 500 caracteres", maxLength(500)),
    },
    socials: {
      $each: helpers.forEach({
        url: {
          required: helpers.withMessage("La URL es requerida", required),
          url: helpers.withMessage("Debe ser una URL válida", urlValidator),
        },
      }),
    },
  },
};

const v$ = useVuelidate(rules, { form });

async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (isValid) {
    homeEditorStore.save();
  }
}
// end validation

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
  { name: "GitLab", iconName: "logoGitlab" },
  { name: "Bitbucket", iconName: "logoBitbucket" },
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
  { name: "ChatBox", iconName: "chatbox" },
];
// end available socials

// computed
const filteredSocials = computed(() => {
  const selectedPlatforms = form.value.socials
    .filter((s) => s.platform)
    .map((s) => s.platform.toLowerCase());
  return availableSocials.filter(
    (social) => !selectedPlatforms.includes(social.name.toLowerCase()),
  );
});

const displayedSocials = computed(() => {
  const q = String(socialSearch.value || "")
    .trim()
    .toLowerCase();
  if (!q) return filteredSocials.value;
  return filteredSocials.value.filter((s) => s.name.toLowerCase().includes(q));
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
  form.value.socials.push({ platform, url: "", iconName });
}

function selectSocial(platform: string) {
  addSocial({ platform });
  closeSocialModal();
}

function closeSocialModal() {
  isSocialModalOpen.value = false;
  socialSearch.value = "";
}

function removeSocial(params: { index: number }) {
  const { index } = params;
  form.value.socials.splice(index, 1);
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
  form.value.name = "Juan Pérez";
  homeEditorStore.form.tags = [
    "Desarrollador",
    "Full-Stack",
    "Vue.js",
    "Laravel",
  ];
  form.value.description =
    "Desarrollador Full-Stack con más de 5 años de experiencia en el desarrollo de aplicaciones web y móviles. Especializado en Vue.js, Laravel y bases de datos relacionales.";
  form.value.socials = [
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
