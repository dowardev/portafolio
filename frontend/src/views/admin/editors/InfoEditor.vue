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
    </ion-list-header>

    <ion-card class="shadow1">
      <ion-card-content>
        <div class="chips-container">
          <ion-chip
            v-for="(tagItem, tagIndex) in tags"
            :key="tagItem + '-' + tagIndex"
            color="primary"
          >
            <ion-label>{{ tagItem }}</ion-label>
            <ion-icon
              :icon="closeOutline"
              @click="emit('remove-tag', tagIndex)"
            ></ion-icon>
          </ion-chip>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-list>

  <ion-list>
    <ion-list-header>
      <ion-label>Redes sociales</ion-label>
    </ion-list-header>

    <ion-card class="shadow1">
      <template
        v-for="(socialItem, socialIndex) in form.socials"
        :key="socialIndex"
      >
        <ion-item lines="full">
          <ion-icon
            v-if="socialItem.platform"
            slot="start"
            :icon="getIconByName({ iconName: socialItem.platform })"
          ></ion-icon>
          <ion-label>{{ socialItem.platform || "Plataforma" }}</ion-label>

          <ion-input
            slot="end"
            v-model="socialItem.url"
            placeholder="https://..."
            type="url"
            :error-text="
              v$.form.socials.$each.$response?.$errors[
                socialIndex
              ]?.url?.[0]?.$message?.toString()
            "
            :class="{
              'ion-invalid':
                v$.form.socials.$each.$response?.$errors[socialIndex]?.url
                  ?.length,
              'ion-touched': v$.form.socials.$dirty,
            }"
            @ion-blur="v$.form.socials.$touch()"
          ></ion-input>

          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            @click="removeSocial({ socialIndex })"
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
          @click="openFileDialog({ targetType: 'logo' })"
        >
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
          @change="onFileChange({ fileEvent: $event, fileType: 'logo' })"
        />
      </section>

      <section>
        <ion-item
          lines="full"
          button
          @click="openFileDialog({ targetType: 'photo' })"
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
          @change="onFileChange({ fileEvent: $event, fileType: 'photo' })"
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

  <!-- modals -->
  <ion-modal
    :is-open="isReorderModalOpen"
    @did-dismiss="onReorderDismiss"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Reordenar etiquetas</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="closeReorderModal"
            >Cerrar</ion-button
          >
          <ion-button color="primary" @click="saveReorder"
            >Guardar</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-reorder-group
          :disabled="false"
          @ion-item-reorder="handleReorder"
        >
          <ion-item v-for="localTagItem in localTags" :key="localTagItem.id">
            <ion-label>{{ localTagItem.label }}</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      </ion-list>
    </ion-content>
  </ion-modal>
  <!-- end modals -->

  <!-- alerts -->
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
  <!-- end alerts -->
</template>

<script setup lang="ts">
// imports
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonReorder,
  IonReorderGroup,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import {
  addOutline,
  closeOutline,
  linkOutline,
  reorderThreeOutline,
  trashOutline,
  logoAmazon,
  logoApple,
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
import useVuelidate from "@vuelidate/core";
import {
  helpers,
  maxLength,
  minLength,
  required,
  url as urlValidator,
} from "@vuelidate/validators";
import { reactive, ref, watch } from "vue";
// end imports

// interface and types imports
interface SocialItem {
  platform: string;
  url: string;
  iconName: string;
}

interface LocalTag {
  id: string;
  label: string;
}

type FileType = "logo" | "photo";

interface ReorderEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | LocalTag[]) => LocalTag[];
}
// end interface and types imports

// main
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
  "remove-tag": [tagIndex: number];
  "add-tag": [tagValue: string];
  "file-change": [payload: { file: File; type: FileType }];
  "update:showContactForm": [value: { socials: boolean; freelance: boolean }];
  save: [payload: { name: string; description: string; socials: SocialItem[] }];
  "reorder-tags": [tags: string[]];
}>();
// end main

// vars and const
const isAddTagAlertOpen = ref(false);
const isReorderModalOpen = ref(false);
const fileNames = reactive<Record<string, string>>({});
const newTag = ref("");

let tagIdCounter = 0;

const localTags = ref<LocalTag[]>([]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  logoAmazon,
  logoApple,
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

const addTagAlertButtons = [
  {
    text: "Cancelar",
    role: "cancel",
  },
  {
    text: "Agregar",
    role: "confirm",
    handler: (alertData: { tag?: string } | undefined) => {
      const tagValue = alertData?.tag ?? newTag.value;
      if (tagValue && tagValue.toString().trim()) {
        const trimmedValue = tagValue.toString().trim();
        emit("add-tag", trimmedValue);
        localTags.value.push({
          id: `tag_${Date.now()}_${tagIdCounter++}`,
          label: trimmedValue,
        });
      }
      newTag.value = "";
      isAddTagAlertOpen.value = false;
    },
  },
];

const availableSocials = [
  { name: "Amazon", iconName: "logoAmazon" },
  { name: "Apple", iconName: "logoApple" },
  { name: "Behance", iconName: "logoBehance" },
  { name: "Bitbucket", iconName: "logoBitbucket" },
  { name: "ChatBox", iconName: "chatbox" },
  { name: "Discord", iconName: "logoDiscord" },
  { name: "Dribbble", iconName: "logoDribbble" },
  { name: "Facebook", iconName: "logoFacebook" },
  { name: "GitHub", iconName: "logoGithub" },
  { name: "GitLab", iconName: "logoGitlab" },
  { name: "Google", iconName: "logoGoogle" },
  { name: "Instagram", iconName: "logoInstagram" },
  { name: "LinkedIn", iconName: "logoLinkedin" },
  { name: "Medium", iconName: "logoMedium" },
  { name: "PayPal", iconName: "logoPaypal" },
  { name: "Pinterest", iconName: "logoPinterest" },
  { name: "Reddit", iconName: "logoReddit" },
  { name: "Slack", iconName: "logoSlack" },
  { name: "Snapchat", iconName: "logoSnapchat" },
  { name: "SoundCloud", iconName: "logoSoundcloud" },
  { name: "Stack Overflow", iconName: "logoStackoverflow" },
  { name: "Steam", iconName: "logoSteam" },
  { name: "Twitch", iconName: "logoTwitch" },
  { name: "Twitter", iconName: "logoTwitter" },
  { name: "TikTok", iconName: "logoTiktok" },
  { name: "Tumblr", iconName: "logoTumblr" },
  { name: "VK", iconName: "logoVk" },
  { name: "Vimeo", iconName: "logoVimeo" },
  { name: "WeChat", iconName: "logoWechat" },
  { name: "WhatsApp", iconName: "logoWhatsapp" },
  { name: "WordPress", iconName: "logoWordpress" },
  { name: "X", iconName: "logoX" },
  { name: "Xbox", iconName: "logoXbox" },
  { name: "YouTube", iconName: "logoYoutube" },
  { name: "PlayStation", iconName: "logoPlaystation" },
  { name: "Skype", iconName: "logoSkype" },
  { name: "Bitcoin", iconName: "logoBitcoin" },
];

const form = ref<{
  name: string;
  description: string;
  socials: SocialItem[];
}>({
  name: "",
  description: "",
  socials: [],
});

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
// end vars and const

// watch
watch(
  () => props.tags,
  () => {
    localTags.value = createLocalTags();
  },
  { immediate: true },
);

watch(
  () => props.initialData,
  (initialDataValue) => {
    form.value.name = initialDataValue.name;
    form.value.description = initialDataValue.description;
    form.value.socials = initialDataValue.socials.map((socialItem) => ({
      ...socialItem,
    }));
  },
  { immediate: true },
);
// end watch

// functions
function createLocalTags(): LocalTag[] {
  return (props.tags || []).map((tagLabel) => ({
    id: `tag_${Date.now()}_${tagIdCounter++}`,
    label: tagLabel,
  }));
}

function getIconByName(params: { iconName: string }) {
  const { iconName } = params;
  if (!iconName) return linkOutline;

  let icon = iconMap[iconName];
  if (icon) return icon;

  const logoIconName = `logo${iconName.charAt(0).toUpperCase()}${iconName.slice(1).replace(/\s/g, "")}`;
  icon = iconMap[logoIconName];
  if (icon) return icon;

  const matchedSocial = availableSocials.find(
    (socialItem) => socialItem.name.toLowerCase() === iconName.toLowerCase(),
  );
  if (matchedSocial) {
    icon = iconMap[matchedSocial.iconName];
    if (icon) return icon;
  }

  return linkOutline;
}

function removeSocial(params: { socialIndex: number }) {
  const { socialIndex } = params;
  form.value.socials.splice(socialIndex, 1);
}

function onFileChange(params: { fileEvent: Event; fileType: FileType }) {
  const { fileEvent, fileType } = params;
  const inputElement = fileEvent.target as HTMLInputElement;
  if (!inputElement.files?.length) return;
  const selectedFile = inputElement.files[0];
  fileNames[fileType] = selectedFile.name;
  emit("file-change", { file: selectedFile, type: fileType });
}

function openFileDialog(params: { targetType: FileType }) {
  const { targetType } = params;
  const selector = `input[data-type="${targetType}"]`;
  const inputElement = document.querySelector(
    selector,
  ) as HTMLInputElement | null;
  if (inputElement) inputElement.click();
}

function closeReorderModal() {
  isReorderModalOpen.value = false;
  localTags.value = createLocalTags();
}

function onReorderDismiss() {
  closeReorderModal();
}

function handleReorder(reorderEvent: CustomEvent<ReorderEventDetail>) {
  const detail = reorderEvent.detail as ReorderEventDetail;
  const { from: originIndex, to: destinationIndex, complete } = detail;

  try {
    const reorderResult = complete(localTags.value);
    if (Array.isArray(reorderResult)) {
      if (reorderResult.length && typeof reorderResult[0] === "string") {
        const labelMapping = new Map(
          localTags.value.map((localTag) => [localTag.label, localTag]),
        );
        localTags.value = (reorderResult as unknown as string[]).map(
          (label) =>
            labelMapping.get(label) || {
              id: `tag_${Date.now()}_${tagIdCounter++}`,
              label,
            },
        );
      } else {
        localTags.value = (reorderResult as unknown as LocalTag[]).slice();
      }
    }
  } catch {
    if (originIndex !== destinationIndex) {
      const movedTag = localTags.value.splice(originIndex, 1)[0];
      localTags.value.splice(destinationIndex, 0, movedTag);
    }
    try {
      complete(false);
    } catch {
      // ignore
    }
  }
}

function saveReorder() {
  const reorderedLabels = localTags.value.map((localTag) => localTag.label);
  emit("reorder-tags", reorderedLabels);
  isReorderModalOpen.value = false;
}

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
