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
          isNew ? "Nueva Plataforma" : "Editar Plataforma"
        }}</ion-title>

        <ion-buttons slot="end">
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
                <ion-list-header>
                  <ion-label>Plataforma</ion-label>
                </ion-list-header>

                <ion-card class="shadow1">
                  <ion-item lines="full">
                    <ion-input
                      v-model="localItem.name"
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
                      v-model="localItem.url"
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
                      :disabled="!localItem.image"
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

                <ion-list-header>
                  <ion-label>Comentario</ion-label>
                </ion-list-header>

                <ion-card v-if="localItem.comment" class="shadow1">
                  <ion-item lines="full">
                    <ion-input
                      v-model="localItem.comment.title"
                      label="Nombre del cliente"
                      label-placement="floating"
                      placeholder="Nombre del cliente"
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="full">
                    <ion-input
                      v-model="localItem.comment.rating"
                      label="Calificación (1-5)"
                      label-placement="floating"
                      type="number"
                      min="1"
                      max="5"
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="full">
                    <ion-textarea
                      v-model="localItem.comment.text"
                      label="Comentario"
                      label-placement="floating"
                      :rows="4"
                      placeholder="Escribe el comentario..."
                    ></ion-textarea>
                  </ion-item>

                </ion-card>
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
  alertController,
} from "@ionic/vue";
import {
  trashOutline,
  eyeOutline,
  closeOutline,
  saveOutline,
} from "ionicons/icons";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { FreelanceItem } from "@/services/types";
import FreelanceController from "@/controllers/freelanceController";
import { useFreelanceStore } from "@/store/freelanceStore";

const route = useRoute();
const router = useRouter();
const freelanceController = new FreelanceController();
const freelanceStore = useFreelanceStore();

const freelanceIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const isNew = computed(() => route.name === "FreelanceNewPage");

const loading = ref(true);
const saving = ref(false);

const localItem = ref<FreelanceItem | null>(null);

onMounted(async () => {
  try {
    if (freelanceStore.freelance.length === 0) {
      const data = await freelanceController.loadFreelance();
      freelanceStore.setFreelance(data);
    }

    if (isNew.value) {
      localItem.value = {
        name: "",
        image: "",
        url: "",
        comment: {
          title: "",
          text: "",
          rating: 5,
        },
      };
    } else if (freelanceIndex.value !== undefined) {
      const item = freelanceStore.getFreelanceItem(freelanceIndex.value);
      if (item) {
        localItem.value = {
          ...item,
          comment: item.comment
            ? { ...item.comment }
            : { title: "", text: "", rating: 5 },
        };
      }
    }
  } finally {
    loading.value = false;
  }
});

async function handleSave() {
  if (!localItem.value) return;

  nameTouched.value = true;
  urlTouched.value = true;
  imageTouched.value = true;

  if (nameError.value || urlError.value || imageError.value) {
    return;
  }

  saving.value = true;
  try {
    if (isNew.value) {
      freelanceStore.addFreelanceItem(localItem.value);
    } else if (freelanceIndex.value !== undefined) {
      freelanceStore.updateFreelanceItem(freelanceIndex.value, localItem.value);
    }

    await freelanceController.saveFreelance(
      freelanceStore.freelance,
      pendingFiles,
    );
    router.push("/admin-panel/freelance");
  } catch (error) {
    console.error("Error saving freelance:", error);
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  const alert = await alertController.create({
    header: "Eliminar plataforma",
    message: "¿Estás seguro de eliminar esta plataforma?",
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
  if (freelanceIndex.value === undefined) return;
  freelanceStore.deleteFreelanceItem(freelanceIndex.value);
  await freelanceController.saveFreelance(freelanceStore.freelance);
  router.push("/admin-panel/freelance");
}

const pendingFiles: Record<string, File> = {};

const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

const nameTouched = ref(false);
const urlTouched = ref(false);
const imageTouched = ref(false);

const nameError = computed(() => {
  if (!localItem.value?.name?.trim()) return "Nombre es requerido";
  return "";
});

const urlError = computed(() => {
  if (!localItem.value?.url?.trim()) return "Link es requerido";
  try {
    new URL(localItem.value.url);
  } catch {
    return "Debe ser una URL válida";
  }
  return "";
});

const imageError = computed(() => {
  if (!localItem.value?.image) return "Logo es requerido";
  return "";
});

function openFileDialog() {
  fileInput.value?.click();
}

function onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles["freelance_image"] = file;
  if (localItem.value) {
    localItem.value.image = URL.createObjectURL(file);
  }
  fileName.value = file.name;
  imageTouched.value = true;
}

function showPreview() {
  const src = localItem.value?.image;
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