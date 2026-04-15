<template>
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
            'ion-invalid':
              v$.form.description.$invalid && v$.form.description.$dirty,
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
        <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
      </ion-button>

      <ion-button @click="isReorderModalOpen = true">
        <ion-icon slot="icon-only" :icon="reorderThreeOutline"></ion-icon>
      </ion-button>

      <ion-alert
        :is-open="isAddTagAlertOpen"
        header="Agregar etiqueta"
        :inputs="[
          { name: 'tag', type: 'text', placeholder: 'Etiqueta', value: newTag },
        ]"
        :buttons="addTagAlertButtons"
        @did-dismiss="
          () => {
            isAddTagAlertOpen = false;
            newTag = '';
          }
        "
      ></ion-alert>
    </ion-list-header>

    <ion-card class="shadow1">
      <ion-card-content>
        <div class="chips-container">
          <ion-chip v-for="(tag, index) in tags" :key="tag + '-' + index" color="primary">
            <ion-label>{{ tag }}</ion-label>
            <ion-icon
              :icon="closeOutline"
              @click="emit('remove-tag', index)"
            ></ion-icon>
          </ion-chip>
        </div>
      </ion-card-content>
    </ion-card>
    <!-- Reorder Modal -->
    <ion-modal :is-open="isReorderModalOpen" @did-dismiss="onReorderDismiss">
      <ion-header>
        <ion-toolbar>
          <ion-title>Reordenar etiquetas</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" @click="closeReorderModal">Cerrar</ion-button>
            <ion-button color="primary" @click="saveReorder">Guardar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-list>
          <ion-reorder-group :disabled="false" @ion-item-reorder="handleReorder">
            <ion-item v-for="t in localTags" :key="t.id">
              <ion-label>{{ t.label }}</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        </ion-list>
      </ion-content>
    </ion-modal>
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
      <template v-for="(social, index) in form.socials" :key="index">
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
            :error-text="
              v$.form.socials.$each.$response?.$errors[
                index
              ]?.url?.[0]?.$message?.toString()
            "
            :class="{
              'ion-invalid':
                v$.form.socials.$each.$response?.$errors[index]?.url?.length,
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
        <ion-item lines="full" button @click="openFileDialog({ type: 'logo' })">
          <ion-label>Logo</ion-label>

          <ion-note v-if="fileNames.logo" slot="end">{{
            fileNames.logo
          }}</ion-note>
          <ion-note v-else slot="end">Seleccionar</ion-note>
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
          :checked="showContactForm.socials"
          @ion-change="
            emit('update:showContactForm', {
              ...showContactForm,
              socials: $event.detail.checked,
            })
          "
        ></ion-toggle>
      </ion-item>

      <ion-item>
        <ion-label>Mostrar botón de contacto (freelance)</ion-label>
        <ion-note slot="end">En sección de plataformas</ion-note>

        <ion-toggle
          slot="end"
          :checked="showContactForm.freelance"
          @ion-change="
            emit('update:showContactForm', {
              ...showContactForm,
              freelance: $event.detail.checked,
            })
          "
        ></ion-toggle>
      </ion-item>
    </ion-card>
  </ion-list>
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
  IonList,
  IonToggle,
  IonButton,
  IonAlert,
  IonNote,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonReorderGroup,
  IonReorder,
} from "@ionic/vue";
// import types for reorder event
import type { ItemReorderEventDetail } from '@ionic/core';
import { ref, reactive, watch } from "vue";
import {
  addOutline,
  closeOutline,
  trashOutline,
  linkOutline,
  reorderThreeOutline,
} from "ionicons/icons";
// import all ionicons dynamically for lookup in getIconByName
import * as ionicons from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  helpers,
  url as urlValidator,
} from "@vuelidate/validators";
// end imports

// props y emits
interface SocialItem {
  platform: string;
  url: string;
  iconName: string;
}

const props = defineProps<{
  tags: string[];
  initialData: {
    name: string;
    description: string;
    socials: SocialItem[];
  };
  showContactForm: {
    socials: boolean;
    freelance: boolean;
  };
}>();

const emit = defineEmits<{
  "remove-tag": [index: number];
  "add-tag": [value: string];
  "file-change": [payload: { file: File; type: "logo" | "photo" }];
  "update:showContactForm": [value: { socials: boolean; freelance: boolean }];
  save: [payload: { name: string; description: string; socials: SocialItem[] }];
  "reorder-tags": [value: string[]];
}>();
// end props y emits

// vars and const
const isAddTagAlertOpen = ref(false);
const isSocialModalOpen = ref(false);
const isReorderModalOpen = ref(false);
const fileNames = reactive<Record<string, string>>({});
const newTag = ref("");
// localTags holds objects with stable ids to avoid key collisions when labels repeat
type LocalTag = { id: string; label: string };
let _tagIdCounter = 0;
function makeLocalTagsFromProps(): LocalTag[] {
  return (props.tags || []).map((t) => ({ id: `tag_${Date.now()}_${_tagIdCounter++}`, label: t }));
}
const localTags = ref<LocalTag[]>(makeLocalTagsFromProps());

const addTagAlertButtons = [
  {
    text: "Cancelar",
    role: "cancel",
  },
  {
    text: "Agregar",
    role: "confirm",
    handler: (data: { tag?: string } | undefined) => {
      const value = data?.tag ?? newTag.value;
      if (value && value.toString().trim()) {
        const trimmed = value.toString().trim();
        emit("add-tag", trimmed);
        // update local copy so UI updates immediately even if parent doesn't
        localTags.value.push({ id: `tag_${Date.now()}_${_tagIdCounter++}`, label: trimmed });
      }
      newTag.value = "";
      isAddTagAlertOpen.value = false;
    },
  },
];
// end vars and const

// keep localTags in sync with props.tags
watch(() => props.tags, () => {
  // recreate localTags from props.tags (keep simple mapping)
  localTags.value = makeLocalTagsFromProps();
});

// validation
const form = ref<{
  name: string;
  description: string;
  socials: SocialItem[];
}>({
  name: "",
  description: "",
  socials: [],
});

// poblar form local cuando initialData cambia (datos del servidor)
watch(
  () => props.initialData,
  (data) => {
    form.value.name = data.name;
    form.value.description = data.description;
    form.value.socials = data.socials.map((s) => ({ ...s }));
  },
  { immediate: true },
);

const alphaName = helpers.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/);

const rules = {
  form: {
    name: {
      required: helpers.withMessage("El nombre es requerido", required),
      minLength: helpers.withMessage(
        "El nombre debe tener al menos 2 caracteres",
        minLength(2),
      ),
      maxLength: helpers.withMessage(
        "El nombre no puede exceder 50 caracteres",
        maxLength(50),
      ),
      alphaName: helpers.withMessage(
        "El nombre solo puede contener letras, espacios y guiones",
        alphaName,
      ),
    },
    description: {
      required: helpers.withMessage("La descripción es requerida", required),
      minLength: helpers.withMessage(
        "La descripción debe tener al menos 10 caracteres",
        minLength(10),
      ),
      maxLength: helpers.withMessage(
        "La descripción no puede exceder 500 caracteres",
        maxLength(500),
      ),
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
    emit("save", {
      name: form.value.name,
      description: form.value.description,
      socials: form.value.socials,
    });
  }
}
// end validation

// reorder modal functions
function closeReorderModal() {
  isReorderModalOpen.value = false;
  // rebuild localTags from props.tags to preserve LocalTag shape (id + label)
  localTags.value = makeLocalTagsFromProps();
}

function onReorderDismiss() {
  closeReorderModal();
}

function handleReorder(event: CustomEvent<ItemReorderEventDetail> | { detail: { from: number; to: number; complete: (data?: boolean | any[] | undefined) => any } }) {
  // Ionic's ItemReorderEventDetail.complete has signature (data?: boolean | any[]) => any
  // Accept either the typed CustomEvent or a compatible object and normalize.
  const detail = (event as any).detail as ItemReorderEventDetail & { complete?: (data?: boolean | any[] | undefined) => any };
  const { from, to, complete } = detail;
  // Try to pass the array of objects (LocalTag[]) to Ionic's complete and normalize result.
  try {
    const result = complete(localTags.value as unknown);
    if (Array.isArray(result)) {
      // result may be array of strings (labels) or LocalTag objects; normalize
      if (result.length && typeof result[0] === "string") {
        const labelToExisting = new Map(localTags.value.map((l) => [l.label, l]));
        localTags.value = (result as unknown as string[]).map((label) =>
          labelToExisting.get(label) || { id: `tag_${Date.now()}_${_tagIdCounter++}`, label },
        );
      } else {
        localTags.value = (result as unknown as LocalTag[]).slice();
      }
    }
  } catch {
    // fallback: manual reorder and tell ionic we handled the DOM
    if (from !== to) {
      const moved = localTags.value.splice(from, 1)[0];
      localTags.value.splice(to, 0, moved);
    }
    try {
      complete(false);
    } catch {
      // ignore
    }
  }
}

function saveReorder() {
  // emit an array of labels (strings) so parent can update its tags
  emit("reorder-tags", localTags.value.map((l) => l.label));
  isReorderModalOpen.value = false;
}

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

function removeSocial(params: { index: number }) {
  const { index } = params;
  form.value.socials.splice(index, 1);
}

function removeTag(index: number) {
  // remove from local copy and notify parent
  localTags.value.splice(index, 1);
  emit("remove-tag", index);
}

function onFileChange(params: { event: Event; type: "logo" | "photo" }) {
  const { event, type } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  fileNames[type] = file.name;
  emit("file-change", { file, type });
}

function openFileDialog(params: { type: "logo" | "photo" }) {
  const { type } = params;
  const selector = `input[data-type="${type}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function fillTestData() {
  form.value.name = "Juan Pérez";
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

defineExpose({ fillTestData, handleSubmit });
// end functions
</script>

<style scoped>
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
input[type="file"] {
  margin-top: 8px;
}
</style>
