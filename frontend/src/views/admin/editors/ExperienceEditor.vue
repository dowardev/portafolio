<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/admin-panel/experience"
          ></ion-back-button>
        </ion-buttons>

        <ion-title>{{
          isNew ? "Nueva Experiencia" : "Editar Experiencia"
        }}</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="!isNew && experienceIndex !== undefined"
            color="danger"
            fill="clear"
            @click="confirmDelete"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>

          <ion-button :disabled="experienceStore.saving" @click="handleSave">
            <ion-spinner
              v-if="experienceStore.saving"
              slot="start"
            ></ion-spinner>
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div
        v-if="experienceStore.loading || !experienceStore.loaded"
        class="ion-text-center ion-padding"
      >
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else>
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-list-header>
                  <ion-label>Datos</ion-label>
                </ion-list-header>

                <ion-card class="shadow1">
                  <ion-item lines="full">
                    <ion-input
                      v-model="localExperience.title"
                      label="Nombre / Empresa"
                      label-placement="floating"
                      placeholder="Ej: Upwork"
                      :error-text="titleError"
                      :class="{
                        'ion-invalid': titleTouched && !!titleError,
                        'ion-touched': titleTouched,
                      }"
                      @ion-blur="titleTouched = true"
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="full" button @click="openStartDatePopover">
                    <ion-label>Inicio</ion-label>
                    <ion-note slot="end">{{ formattedStartDate }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="startDatePopoverOpen"
                    @ion-popover-dismiss="closeStartDatePopover"
                  >
                    <ion-datetime
                      presentation="month-year"
                      locale="es-ES"
                      :value="localExperience.startDate ?? undefined"
                      :max="localExperience.endDate || undefined"
                      @ion-change="onStartDateChange"
                    ></ion-datetime>
                  </ion-popover>

                  <ion-item lines="full" button @click="openEndDatePopover">
                    <ion-label>Fin</ion-label>
                    <ion-note slot="end">{{ formattedEndDate }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="endDatePopoverOpen"
                    @ion-popover-dismiss="closeEndDatePopover"
                  >
                    <ion-datetime
                      presentation="month-year"
                      locale="es-ES"
                      :value="localExperience.endDate ?? undefined"
                      :min="localExperience.startDate || undefined"
                      @ion-change="onEndDateChange"
                    ></ion-datetime>
                  </ion-popover>

                  <ion-item lines="full" button @click="openFileDialog">
                    <ion-label>Logo de la empresa</ion-label>

                    <ion-note v-if="fileName" slot="end">{{
                      fileName
                    }}</ion-note>

                    <ion-note v-else slot="end">Seleccionar</ion-note>

                    <ion-button
                      slot="end"
                      fill="clear"
                      :disabled="!localExperience.img"
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
                    @change="onFileChange"
                  />

                  <span v-if="imgTouched && imgError" class="error">{{
                    imgError
                  }}</span>

                  <ion-item lines="full">
                    <ion-textarea
                      v-model="localExperience.details.description"
                      label="Descripción"
                      label-placement="floating"
                      :rows="3"
                      placeholder="Descripción del trabajo..."
                      :error-text="descriptionError"
                      :class="{
                        'ion-invalid': descriptionTouched && !!descriptionError,
                        'ion-touched': descriptionTouched,
                      }"
                      @ion-blur="descriptionTouched = true"
                    ></ion-textarea>
                  </ion-item>

                  <ion-item lines="full">
                    <ion-input
                      v-model="localExperience.details.website"
                      label="Link"
                      label-placement="floating"
                      placeholder="https://..."
                    ></ion-input>
                  </ion-item>
                </ion-card>
              </ion-list>

              <TechnologiesEditor
                v-model="localExperience.technologies"
                @update:files="updateTechFiles"
              />
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>

      <!-- modals -->
      <!-- preview modal -->
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
      <!-- modals -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// imports
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
  IonDatetime,
  IonModal,
  IonPopover,
} from "@ionic/vue";
import {
  trashOutline,
  eyeOutline,
  closeOutline,
  saveOutline,
} from "ionicons/icons";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ExperienceItem } from "@/services/types";
import TechnologiesEditor from "./TechnologiesEditor.vue";
import ExperienceController from "@/controllers/experienceController";
import { useExperienceStore } from "@/store/experienceStore";
// end imports

const route = useRoute();
const router = useRouter();
const experienceController = new ExperienceController();
const experienceStore = useExperienceStore();

const experienceIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const isNew = computed(() => route.name === "ExperienceNewPage");

const localExperience = ref<ExperienceItem>({
  img: "",
  title: "",
  startDate: "",
  endDate: undefined,
  technologies: [],
  details: { description: "", website: "" },
});

onMounted(async () => {
  await experienceController.loadExperiences();
  if (isNew.value) {
    localExperience.value = {
      img: "",
      title: "",
      startDate: "",
      endDate: undefined,
      technologies: [],
      details: { description: "", website: "" },
    };
  } else if (experienceIndex.value !== undefined) {
    const exp = experienceController.getExperience(experienceIndex.value);
    if (exp) {
      localExperience.value = { ...exp };
    }
  }
});

async function handleSave() {
  try {
    const success = await experienceController.saveExperience(
      localExperience.value,
      isNew.value ? undefined : experienceIndex.value,
    );
    if (success) {
      router.push("/admin-panel/experience");
    }
  } catch (error) {
    console.error("Error saving experience:", error);
  }
}

async function confirmDelete() {
  const alert = await alertController.create({
    header: "Eliminar experiencia",
    message: "¿Estás seguro de eliminar esta experiencia?",
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => deleteExperience(),
      },
    ],
  });
  await alert.present();
}

async function deleteExperience() {
  if (experienceIndex.value === undefined) return;
  const success = await experienceController.deleteExperience(
    experienceIndex.value,
  );
  if (success) {
    router.push("/admin-panel/experience");
  }
}

// vars and const
const pendingFiles: Record<string, File> = {};
const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

// validation state
const titleTouched = ref(false);
const imgTouched = ref(false);
const descriptionTouched = ref(false);
// end vars and const

// formatted dates for UI (inline to avoid referencing helper in template)
const formattedStartDate = computed(() => {
  const d = localExperience.value.startDate;
  if (!d) return "Seleccionar";
  return new Date(d).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
});

const formattedEndDate = computed(() => {
  const d = localExperience.value.endDate;
  if (!d) return "Seleccionar";
  return new Date(d).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
});

// validation computed
const titleError = computed(() => {
  if (!localExperience.value.title?.trim()) return "Nombre es requerido";
  return "";
});

// startDate validation intentionally omitted here (not used in template)

const imgError = computed(() => {
  if (!localExperience.value.img) return "Logo es requerido";
  return "";
});

const descriptionError = computed(() => {
  if (!localExperience.value.details?.description?.trim())
    return "Descripción es requerida";
  return "";
});

// functions
function updateTechFiles(files: Record<number, File>) {
  Object.keys(pendingFiles).forEach((key) => {
    if (!key.startsWith("exp_tech_image_0_")) {
      delete pendingFiles[key];
    }
  });

  for (const [techIndex, file] of Object.entries(files)) {
    pendingFiles[`exp_tech_image_0_${techIndex}`] = file;
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles["exp_image_0"] = file;
  localExperience.value.img = URL.createObjectURL(file);
  fileName.value = file.name;
  imgTouched.value = true;
}

function openFileDialog() {
  fileInput.value?.click();
}

function showPreview() {
  const src = localExperience.value.img;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}
// date popover state
const startDatePopoverOpen = ref(false);
const endDatePopoverOpen = ref(false);


function openStartDatePopover() {
  startDatePopoverOpen.value = true;
}

function closeStartDatePopover() {
  startDatePopoverOpen.value = false;
}

function onStartDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value) {
    localExperience.value.startDate = value;
  }
  closeStartDatePopover();
}

function openEndDatePopover() {
  endDatePopoverOpen.value = true;
}

function closeEndDatePopover() {
  endDatePopoverOpen.value = false;
}

function onEndDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value) {
    localExperience.value.endDate = value;
  }
  closeEndDatePopover();
}
// end functions
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
