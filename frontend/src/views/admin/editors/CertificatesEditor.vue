<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/admin-panel/certificates"
          ></ion-back-button>
        </ion-buttons>

        <ion-title>{{
          isNew ? "Nuevo Certificado" : "Editar Certificado"
        }}</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="!isNew && certificateIndex !== undefined"
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

      <template v-else-if="localCertificate">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-list-header>
                  <ion-label>Certificado</ion-label>
                </ion-list-header>

                <ion-card class="shadow1">
                  <ion-item lines="full">
                    <ion-input
                      v-model="localCertificate.title"
                      label="Título"
                      label-placement="floating"
                      placeholder="Ej: AWS Certified Developer"
                      :error-text="titleError"
                      :class="{
                        'ion-invalid': titleTouched && !!titleError,
                        'ion-touched': titleTouched,
                      }"
                      @ion-blur="titleTouched = true"
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="full">
                    <ion-input
                      v-model="localCertificate.url"
                      label="Link del certificado"
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
                    <ion-label>Logo / Imagen</ion-label>

                    <ion-note v-if="fileName" slot="end">{{
                      fileName
                    }}</ion-note>

                    <ion-note v-else slot="end">Seleccionar</ion-note>

                    <ion-button
                      slot="end"
                      fill="clear"
                      :disabled="!localCertificate.img"
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

                  <span v-if="imgTouched && imgError" class="error">{{
                    imgError
                  }}</span>
                </ion-card>

                <IconSelector
                  ref="techSkillsRef"
                  :model-value="aptitudes"
                  type="tech"
                  @update:model-value="aptitudes = $event"
                  @add="handleAdd"
                  @remove="handleRemove"
                />
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
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
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

import type { CertificateItem } from "@/services/types";

import IconSelector from "@/components/admin/IconSelector.vue";

import CertificatesController from "@/controllers/certificatesController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";

const { guard } = usePermissionGuard();

const route = useRoute();
const router = useRouter();
const certificatesController = new CertificatesController();
const techSkillsRef = ref<InstanceType<typeof IconSelector> | null>(null);

const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);

const certificateIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const isNew = computed(() => route.name === "CertificateNewPage");

interface AptitudeTechItem {
  iconName: string;
}

const aptitudes = ref<AptitudeTechItem[]>([]);

function handleAdd() {
  aptitudes.value = [...aptitudes.value, { iconName: "" }];
}

function handleRemove(index: number) {
  aptitudes.value = aptitudes.value.filter((_, i) => i !== index);
}

const localCertificate = ref<CertificateItem | null>(null);

let pendingImageFile: File | null = null;

onMounted(async () => {
  loading.value = true;
  const certificates = await certificatesController.loadPublicCertificates();
  if (isNew.value) {
    localCertificate.value = {
      id: "",
      img: "",
      title: "",
      url: "",
      aptitudes: [],
    };
  } else if (certificateIndex.value !== undefined) {
    const cert = certificates[certificateIndex.value];
    if (cert) {
      localCertificate.value = { ...cert };
      aptitudes.value = (Array.isArray(cert.aptitudes) ? cert.aptitudes : []).map((apt) => ({
        iconName: apt.type === 'icon' ? apt.source : '',
      }));
    }
  }
  loading.value = false;
  loaded.value = true;
});

async function handleSave() {
  const requiredPerm = isNew.value ? 'certificates.create' : 'certificates.update';
  if (!(await guard({ permission: requiredPerm, message: `No tienes permisos para ${isNew.value ? 'crear' : 'actualizar'} certificados. Contacta al administrador.` }))) {
    return;
  }

  if (!localCertificate.value) return;
  localCertificate.value.aptitudes = (Array.isArray(aptitudes.value) ? aptitudes.value : [])
    .filter(item => item.iconName?.trim())
    .map(item => ({
      source: item.iconName,
      name: item.iconName,
      type: 'icon' as const,
      size: '24px',
    }));
  saving.value = true;
  try {
    const success = isNew.value
      ? await certificatesController.addCertificate(localCertificate.value, pendingImageFile)
      : await certificatesController.updateCertificate(localCertificate.value.id, localCertificate.value, pendingImageFile);
    if (success) {
      router.push("/admin-panel/certificates");
    }
  } catch (error) {
    console.error("Error saving certificate:", error);
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  if (!(await guard({ permission: 'certificates.delete' }))) {
    return;
  }

  const alert = await alertController.create({
    header: "Eliminar certificado",
    message: "¿Estás seguro de eliminar este certificado?",
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => deleteCertificate(),
      },
    ],
  });
  await alert.present();
}

async function deleteCertificate() {
  if (!localCertificate.value?.id) return;
  const success = await certificatesController.deleteCertificate(
    localCertificate.value.id,
  );
  if (success) {
    router.push("/admin-panel/certificates");
  }
}

const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

const titleTouched = ref(false);
const urlTouched = ref(false);
const imgTouched = ref(false);

const titleError = computed(() => {
  if (!localCertificate.value?.title?.trim()) return "Título es requerido";
  return "";
});

const urlError = computed(() => {
  if (!localCertificate.value?.url?.trim()) return "Link es requerido";
  try {
    new URL(localCertificate.value.url);
  } catch {
    return "Debe ser una URL válida";
  }
  return "";
});

const imgError = computed(() => {
  if (!localCertificate.value?.img) return "Imagen es requerida";
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
  if (localCertificate.value) {
    localCertificate.value.img = URL.createObjectURL(file);
  }
  fileName.value = file.name;
  imgTouched.value = true;
}

function showPreview() {
  const src = localCertificate.value?.img;
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

