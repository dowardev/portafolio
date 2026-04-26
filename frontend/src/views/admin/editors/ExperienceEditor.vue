<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/admin-panel/categories"
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
        v-if="loading || !loaded"
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

                  <ion-item lines="full" button @click="openStartDatePopover($event)">
                    <ion-label>Inicio</ion-label>
                    <ion-note slot="end">{{ formattedStartDate }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="startDatePopoverOpen"
                    :event="startDatePopoverEvent"
                    @did-dismiss="closeStartDatePopover"
                  >
                    <div>
                      <ion-datetime
                        presentation="month-year"
                        locale="es-ES"
                        :show-default-buttons="true"
                        done-text="Aceptar"
                        cancel-text="Cancelar"
                        :value="localExperience.startDate ?? undefined"
                        :max="localExperience.endDate || undefined"
                        @ion-change="onStartDateChange"
                      ></ion-datetime>
                    </div>
                  </ion-popover>

                  <ion-item lines="full" button @click="syncAndOpenEndDatePopover($event)">
                    <ion-label>Fin</ion-label>
                    <ion-note slot="end">{{ formattedEndDate }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="endDatePopoverOpen"
                    :event="endDatePopoverEvent"
                    @did-dismiss="closeEndDatePopover"
                  >
                    <div>
                      <ion-datetime
                        presentation="month-year"
                        locale="es-ES"
                        :show-default-buttons="true"
                        done-text="Aceptar"
                        cancel-text="Cancelar"
                        :value="localExperience.endDate ?? undefined"
                        :min="localExperience.startDate || undefined"
                        @ion-change="onEndDateChange"
                      ></ion-datetime>

                      <ion-item lines="full">
                        <ion-checkbox
                          :checked="isCurrentJob"
                          @click="onIsCurrentJobClick"
                          @blur="endDateTouched = true"
                        >
                          Actualidad
                        </ion-checkbox>
                      </ion-item>

                      <span v-if="endDateTouched && endDateError" class="error">{{
                        endDateError
                      }}</span>
                    </div>
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

              <TechSkillsEditor
                ref="techSkillsRef"
                :model-value="technologies"
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
import TechSkillsEditor from "./TechSkillsEditor.vue";
import ExperienceController from "@/controllers/experienceController";

const route = useRoute();
const router = useRouter();
const experienceController = new ExperienceController();
const techSkillsRef = ref<InstanceType<typeof TechSkillsEditor> | null>(null);

const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);

const experienceIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const isNew = computed(() => route.name === "ExperienceNewPage");

const technologies = computed({
  get: () => localExperience.value.technologies,
  set: (value) => {
    localExperience.value.technologies = value;
  },
});

const localExperience = ref<ExperienceItem>({
  id: "",
  img: "",
  title: "",
  startDate: "",
  endDate: undefined,
  technologies: [],
  details: { description: "", website: "" },
});

let pendingImageFile: File | null = null;

onMounted(async () => {
  loading.value = true;
  const experiences = await experienceController.loadPublicExperiences();
  if (isNew.value) {
    localExperience.value = {
      id: "",
      img: "",
      title: "",
      startDate: "",
      endDate: undefined,
      technologies: [],
      details: { description: "", website: "" },
    };
  } else if (experienceIndex.value !== undefined) {
    const exp = experiences[experienceIndex.value];
    if (exp) {
      localExperience.value = { ...exp };
      isCurrentJob.value = !localExperience.value.endDate;
    }
  }
  loading.value = false;
  loaded.value = true;
});

async function handleSave() {
  if (techSkillsRef.value) {
    localExperience.value.technologies = techSkillsRef.value.modelValue;
  }
  saving.value = true;
  try {
    const success = isNew.value
      ? await experienceController.addExperience(localExperience.value, pendingImageFile)
      : await experienceController.updateExperience(
          localExperience.value.id,
          localExperience.value,
          pendingImageFile,
        );
    if (success) {
      router.push("/admin-panel/experience");
    }
  } catch (error) {
    console.error("Error saving experience:", error);
  } finally {
    saving.value = false;
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
  if (!localExperience.value?.id) return;
  const success = await experienceController.deleteExperience(
    localExperience.value.id,
  );
  if (success) {
    router.push("/admin-panel/experience");
  }
}

// vars and const
const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const isCurrentJob = ref(false);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

// validation state
const titleTouched = ref(false);
const imgTouched = ref(false);
const descriptionTouched = ref(false);
const endDateTouched = ref(false);
// end vars and const

// formatted dates for UI (inline to avoid referencing helper in template)
const formattedStartDate = computed(() => {
  const d = localExperience.value.startDate;
  if (!d) return "Seleccionar";
  return new Date(d).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
});

const formattedEndDate = computed(() => {
  if (isCurrentJob.value) return "Actual";
  const d = localExperience.value.endDate;
  if (!d) return "Seleccionar";
  return new Date(d).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
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

const endDateError = computed(() => {
  if (endDateTouched.value) {
    if (!localExperience.value.endDate && !isCurrentJob.value) {
      return "Selecciona una fecha o marca Actualidad";
    }
  }
  return "";
});

// functions
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingImageFile = file;
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

const startDatePopoverOpen = ref(false);
const endDatePopoverOpen = ref(false);
const startDatePopoverEvent = ref<Event | undefined>(undefined);
const endDatePopoverEvent = ref<Event | undefined>(undefined);

function openStartDatePopover(event: Event) {
  startDatePopoverEvent.value = event;
  startDatePopoverOpen.value = true;
}

function closeStartDatePopover() {
  startDatePopoverOpen.value = false;
  startDatePopoverEvent.value = undefined;
}

function onStartDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value) {
    localExperience.value.startDate = value;
  }
  closeStartDatePopover();
}

function openEndDatePopover(event: Event) {
  endDatePopoverEvent.value = event;
  endDatePopoverOpen.value = true;
}

function syncAndOpenEndDatePopover(event: Event) {
  if (!isNew.value) {
    isCurrentJob.value = !localExperience.value.endDate;
  }
  openEndDatePopover(event);
}

function closeEndDatePopover() {
  endDatePopoverOpen.value = false;
  endDatePopoverEvent.value = undefined;
}

function onEndDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value) {
    localExperience.value.endDate = value;
    isCurrentJob.value = false;
  }
  closeEndDatePopover();
}

function onIsCurrentJobClick() {
  isCurrentJob.value = !isCurrentJob.value;
  if (isCurrentJob.value) {
    localExperience.value.endDate = undefined;
  }
  endDateTouched.value = true;
  closeEndDatePopover();
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
