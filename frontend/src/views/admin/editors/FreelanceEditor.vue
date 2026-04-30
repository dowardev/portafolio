<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/admin-panel/freelance"
          ></ion-back-button>
        </ion-buttons>

        <ion-title>{{
          isNew
            ? (freelanceType === "platform" ? "Nueva Plataforma" : "Nuevo Comentario")
            : (freelanceType === "platform" ? "Editar Plataforma" : "Editar Comentario")
        }}</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="isDev && isNew"
            v-tooltip="{
              content: 'Datos de prueba',
              delay: [500, 0],
              touch: 'hold',
            }"
            color="tertiary"
            @click="generateTestData"
          >
            <ion-icon
              slot="start"
              :icon="bugOutline"
              color="warning"
            ></ion-icon>
          </ion-button>

          <ion-button
            v-if="!isNew && freelanceIndex !== undefined"
            color="danger"
            fill="clear"
            @click="confirmDelete"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>

          <ion-button :disabled="saving" @click="handleSave">
            <ion-spinner
              v-if="saving"
              slot="start"
            ></ion-spinner>
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div
        v-if="loading"
        class="ion-text-center ion-padding"
      >
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else-if="localItem">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <template v-if="freelanceType === 'platform'">
                  <ion-list-header>
                    <ion-label>Plataforma</ion-label>
                  </ion-list-header>

                  <ion-card class="shadow1">
                    <ion-item lines="full">
                      <ion-input
                        v-model="(localItem as FreelancePlatform).name"
                        label="Nombre de la plataforma"
                        label-placement="floating"
                        placeholder="Ej: Upwork"
                        :error-text="nameError"
                        :class="{
                          'ion-invalid': nameTouched && !!nameError,
                          'ion-touched': nameTouched,
                        }"
                        @ion-blur="nameTouched = true"
                      ></ion-input>
                    </ion-item>

                    <ion-item lines="full">
                      <ion-input
                        v-model="(localItem as FreelancePlatform).url"
                        label="Link de la plataforma"
                        label-placement="floating"
                        placeholder="https://..."
                        :error-text="urlError"
                        :class="{
                          'ion-invalid': urlTouched && !!urlError,
                          'ion-touched': urlTouched,
                        }"
                        @ion-blur="urlTouched = true"
                      ></ion-input>
                    </ion-item>

                    <ion-item lines="full" button @click="openFileDialog">
                      <ion-label>Logo de la plataforma</ion-label>

                      <ion-note v-if="fileName" slot="end">{{
                        fileName
                      }}</ion-note>

                      <ion-note v-else slot="end">Seleccionar</ion-note>

                      <ion-button
                        slot="end"
                        fill="clear"
                        :disabled="!(localItem as FreelancePlatform).image"
                        @click.stop="showPreview"
                      >
                        <ion-icon :icon="eyeOutline"></ion-icon>
                      </ion-button>
                    </ion-item>

                    <input
                      ref="fileInput"
                      style="display: none"
                      type="file"
                      accept="image/*"
                      @change="onImageChange"
                    />

                    <span v-if="imageTouched && imageError" class="error">{{
                      imageError
                    }}</span>
                  </ion-card>
                </template>

                <template v-else-if="freelanceType === 'comment'">
                  <ion-list-header>
                    <ion-label>Comentario</ion-label>
                  </ion-list-header>

                  <ion-card class="shadow1">
                    <ion-item lines="full">
                      <ion-input
                        v-model="(localItem as FreelanceComment).title"
                        label="Nombre del cliente"
                        label-placement="floating"
                        placeholder="Nombre del cliente"
                      ></ion-input>
                    </ion-item>

                    <ion-item lines="full">
                      <ion-input
                        v-model="(localItem as FreelanceComment).rating"
                        label="Calificación (1-5)"
                        label-placement="floating"
                        type="number"
                        min="1"
                        max="5"
                      ></ion-input>
                    </ion-item>

                    <ion-item lines="full">
                      <ion-textarea
                        v-model="(localItem as FreelanceComment).text"
                        label="Comentario"
                        label-placement="floating"
                        :rows="4"
                        placeholder="Escribe el comentario..."
                      ></ion-textarea>
                    </ion-item>
                  </ion-card>
                </template>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
    </ion-content>

    <ion-modal :is-open="isPreviewOpen" @ion-modal-did-dismiss="closePreview">
      <ion-header class="ion-no-border" mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="closePreview">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>Vista previa</ion-title>
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
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonModal,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonList,
  IonListHeader,
  IonCard,
  IonNote,
  IonBackButton,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  alertController,
} from "@ionic/vue";
import {
  trashOutline,
  eyeOutline,
  closeOutline,
  saveOutline,
  bugOutline,
} from "ionicons/icons";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { FreelancePlatform, FreelanceComment, FreelanceItem } from "@/services/types";
import FreelancePlatformController from "@/controllers/freelancePlatformController";
import FreelanceCommentController from "@/controllers/freelanceCommentController";

const route = useRoute();
const router = useRouter();
const freelancePlatformController = new FreelancePlatformController();
const freelanceCommentController = new FreelanceCommentController();

const isDev = import.meta.env.DEV;
const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);
const platforms = ref<FreelancePlatform[]>([]);
const comments = ref<FreelanceComment[]>([]);

const freelanceType = computed(() => {
  const type = route.params.type;
  if (typeof type === "string" && (type === "platform" || type === "comment")) {
    return type;
  }
  return "platform";
});

const freelanceIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const freelanceId = ref<string | undefined>(undefined);

const isNew = computed(() => route.name === "FreelanceNewPage" || route.name === "FreelanceNewPageOld");

const localItem = ref<FreelancePlatform | FreelanceComment | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    if (platforms.value.length === 0 && comments.value.length === 0) {
      const [platformsData, commentsData] = await Promise.all([
        freelancePlatformController.loadFreelancePlatforms(),
        freelanceCommentController.loadFreelanceComments(),
      ]);
      platforms.value = platformsData;
      comments.value = commentsData;
    }

    if (isNew.value) {
      if (freelanceType.value === "platform") {
        localItem.value = {
          id: crypto.randomUUID(),
          name: "",
          image: "",
          url: "",
        } as FreelancePlatform;
      } else {
        localItem.value = {
          id: crypto.randomUUID(),
          title: "",
          text: "",
          rating: 5,
        } as FreelanceComment;
      }
    } else if (freelanceIndex.value !== undefined) {
      if (freelanceType.value === "platform") {
        const item = platforms.value?.[freelanceIndex.value];
        if (item) {
          localItem.value = { ...item };
          freelanceId.value = item.id;
        }
      } else {
        const item = comments.value?.[freelanceIndex.value];
        if (item) {
          localItem.value = { ...item };
          freelanceId.value = item.id;
        }
      }
    }
  } finally {
    loading.value = false;
    loaded.value = true;
  }
});

async function handleSave() {
  if (!localItem.value) return;

  if (freelanceType.value === "platform") {
    nameTouched.value = true;
    urlTouched.value = true;
    imageTouched.value = true;

    if (nameError.value || urlError.value || imageError.value) {
      return;
    }

    const item = localItem.value as FreelancePlatform;
    if (isNew.value) {
      await freelancePlatformController.addFreelancePlatform(item, pendingImageFile);
    } else if (freelanceId.value) {
      await freelancePlatformController.updateFreelancePlatform(Number(freelanceId.value), item, pendingImageFile);
    }
    router.push("/admin-panel/freelance");
  } else {
    nameTouched.value = true;

    const item = localItem.value as FreelanceComment;
    const payload = {
      title: item.title,
      text: item.text,
      rating: item.rating,
    };

    saving.value = true;
    try {
      if (isNew.value) {
        await freelanceCommentController.addFreelanceComment(payload);
      } else if (freelanceId.value) {
        await freelanceCommentController.updateFreelanceComment(Number(freelanceId.value), payload);
      }
      router.push("/admin-panel/freelance");
    } finally {
      saving.value = false;
    }
  }
}

async function confirmDelete() {
  const alert = await alertController.create({
    header: `Eliminar ${freelanceType.value === "platform" ? "plataforma" : "comentario"}`,
    message: "¿Estás seguro de eliminar este elemento?",
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => deleteFreelance(),
      },
    ],
  });
  await alert.present();
}

async function deleteFreelance() {
  if (!freelanceId.value) return;

  if (freelanceType.value === "platform") {
    await freelancePlatformController.deleteFreelancePlatform(Number(freelanceId.value));
  } else {
    await freelanceCommentController.deleteFreelanceComment(Number(freelanceId.value));
  }
  router.push("/admin-panel/freelance");
}

function generateTestData() {
  if (freelanceType.value === "platform") {
    const platformNames = ["Upwork", "Fiverr", "Toptal", "Freelancer.com"];
    const platformName = platformNames[Math.floor(Math.random() * platformNames.length)];
    localItem.value = {
      id: crypto.randomUUID(),
      name: platformName,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(platformName)}&background=random&size=100`,
      url: "https://example.com",
    } as FreelancePlatform;
  } else {
    const availablePlatforms = platforms.value;
    localItem.value = {
      id: crypto.randomUUID(),
      title: "Cliente de prueba",
      text: "Este es un comentario de prueba generado automáticamente.",
      rating: 4,
    } as FreelanceComment;
  }
}

const fileName = ref("");
let pendingImageFile: File | null = null;
const fileInput = ref<HTMLInputElement | null>(null);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

const nameTouched = ref(false);
const urlTouched = ref(false);
const imageTouched = ref(false);

const nameError = computed(() => {
  if (!localItem.value || freelanceType.value !== "platform") return "";
  const item = localItem.value as FreelancePlatform;
  if (!item.name?.trim()) return "Nombre es requerido";
  return "";
});

const urlError = computed(() => {
  if (!localItem.value || freelanceType.value !== "platform") return "";
  const item = localItem.value as FreelancePlatform;
  if (!item.url?.trim()) return "Link es requerido";
  try {
    new URL(item.url);
  } catch {
    return "Debe ser una URL válida";
  }
  return "";
});

const imageError = computed(() => {
  if (!localItem.value || freelanceType.value !== "platform") return "";
  const item = localItem.value as FreelancePlatform;
  if (!item.image) return "Logo es requerido";
  return "";
});

function openFileDialog() {
  fileInput.value?.click();
}

function onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingImageFile = file;
  if (localItem.value && freelanceType.value === "platform") {
    (localItem.value as FreelancePlatform).image = URL.createObjectURL(file);
  }
  fileName.value = file.name;
  imageTouched.value = true;
}

function showPreview() {
  if (freelanceType.value !== "platform" || !localItem.value) return;
  const src = (localItem.value as FreelancePlatform).image;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.modal-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>