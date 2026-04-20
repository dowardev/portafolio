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

  <SocialsEditor v-model="form.socials" />

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
  <ion-modal :is-open="isReorderModalOpen" @did-dismiss="onReorderDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-title>Reordenar etiquetas</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="closeReorderModal"
            >Cerrar</ion-button
          >
          <ion-button color="primary" @click="saveReorder">Guardar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-reorder-group :disabled="false" @ion-item-reorder="handleReorder">
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
import { addOutline, closeOutline, reorderThreeOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import { reactive, ref, watch } from "vue";
import SocialsEditor from "./SocialsEditor.vue";
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
