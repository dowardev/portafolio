<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar style="--background: var(--ion-background-color)">
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>

      <ion-title>Info</ion-title>

      <ion-buttons slot="end">
        <ion-button
          v-if="isDev"
          v-tooltip="{
            content: 'Llenar datos de prueba',
            delay: [500, 0],
            touch: 'hold',
          }"
          color="warning"
          @click="infoEditorRef?.fillTestData()"
        >
          <ion-icon :icon="bugOutline"></ion-icon>
        </ion-button>

        <ion-button
          v-tooltip="'Guardar cambios'"
          :disabled="homeEditorStore.saving"
          @click="infoEditorRef?.handleSubmit()"
        >
          <ion-spinner
            v-if="homeEditorStore.saving"
            slot="start"
            name="crescent"
          ></ion-spinner>
          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <ion-breadcrumbs>
            <ion-breadcrumb>
              <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
            </ion-breadcrumb>

            <ion-breadcrumb>Info editor</ion-breadcrumb>
          </ion-breadcrumbs>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <InfoEditor
            ref="infoEditorRef"
            :tags="homeEditorStore.form.tags"
            :initial-data="initialData"
            :show-contact-form="contactForm"
            @remove-tag="handleRemoveTag"
            @add-tag="handleAddTag"
            @reorder-tags="handleReorderTags"
            @file-change="handleFileChange"
            @update:show-contact-form="handleUpdateContactForm"
            @save="handleSave"
          />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { vTooltip } from "@/directives/tooltip";
// register directive locally for this SFC
defineOptions({
  directives: { tooltip: vTooltip },
});
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import InfoEditor from "../editors/InfoEditor.vue";
import { useHomeEditorStore } from "@/store/homeEditorStore";
import HomeEditorController from "@/controllers/homeEditorController";
import { bugOutline, saveOutline } from "ionicons/icons";

const homeEditorStore = useHomeEditorStore();
const homeEditorController = new HomeEditorController();
const infoEditorRef = ref<InstanceType<typeof InfoEditor>>();
const isDev = import.meta.env.DEV;

// datos iniciales para el form del hijo (se actualiza cuando loadData termina)
const initialData = computed(() => ({
  name: homeEditorStore.form.name,
  description: homeEditorStore.form.description,
  socials: homeEditorStore.form.socials,
}));

// showContactForm como computed para manejar el tipo correcto
const contactForm = computed(() => {
  const val = homeEditorStore.form.showContactForm;
  if (typeof val === "boolean") {
    return { socials: val, freelance: val };
  }
  return val as { socials: boolean; freelance: boolean };
});

// handlers de emits
function handleRemoveTag(index: number) {
  homeEditorStore.form.tags.splice(index, 1);
}

function handleAddTag(tag: string) {
  if (!homeEditorStore.form.tags.includes(tag)) {
    homeEditorStore.form.tags.push(tag);
  }
}

function handleReorderTags(tags: string[]) {
  // replace with a shallow copy to ensure reactivity
  homeEditorStore.form.tags = tags.slice();
}

function handleFileChange(payload: { file: File; type: "logo" | "photo" }) {
  homeEditorStore.files[payload.type] = payload.file;
  homeEditorStore.preview[payload.type] = URL.createObjectURL(payload.file);
}

function handleUpdateContactForm(value: {
  socials: boolean;
  freelance: boolean;
}) {
  (homeEditorStore.form.showContactForm as any) = value;
}

async function handleSave(payload: {
  name: string;
  description: string;
  socials: Array<{ platform: string; url: string; iconName: string }>;
}) {
  homeEditorStore.form.name = payload.name;
  homeEditorStore.form.description = payload.description;
  homeEditorStore.form.socials = payload.socials;
  homeEditorStore.setSaving(true);
  try {
    await homeEditorController.save(homeEditorStore.getFormData());
  } finally {
    homeEditorStore.setSaving(false);
  }
}

onMounted(async () => {
  homeEditorStore.setLoading(true);
  try {
    const data = await homeEditorController.loadData();
    homeEditorStore.setData(data);
  } finally {
    homeEditorStore.setLoading(false);
  }
});
</script>
