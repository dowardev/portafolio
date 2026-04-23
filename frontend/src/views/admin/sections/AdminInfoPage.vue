<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar style="--background: var(--ion-background-color)">
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
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
          :disabled="introStore.saving"
          @click="infoEditorRef?.handleSubmit()"
        >
          <ion-spinner
            v-if="introStore.saving"
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
            :tags="introStore.form.tags"
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
import { useIntroStore } from "@/store/introStore";
import IntroController from "@/controllers/introController";
import { bugOutline, saveOutline } from "ionicons/icons";

const introStore = useIntroStore();
const introController = new IntroController();
const infoEditorRef = ref<InstanceType<typeof InfoEditor>>();
const isDev = import.meta.env.DEV;

// datos iniciales para el form del hijo (se actualiza cuando loadIntro termina)
const initialData = computed(() => ({
  name: introStore.form.name,
  description: introStore.form.description,
  socials: introStore.form.socials,
}));

// showContactForm como computed para manejar el tipo correcto
const contactForm = computed(() => {
  const val = introStore.form.showContactForm;
  if (typeof val === "boolean") {
    return { socials: val, freelance: val };
  }
  return val as { socials: boolean; freelance: boolean };
});

// handlers de emits
function handleRemoveTag(index: number) {
  introStore.form.tags.splice(index, 1);
}

function handleAddTag(tag: string) {
  if (!introStore.form.tags.includes(tag)) {
    introStore.form.tags.push(tag);
  }
}

function handleReorderTags(tags: string[]) {
  introStore.form.tags = tags.slice();
}

function handleFileChange(payload: { file: File; type: "logo" | "photo" }) {
  introStore.files[payload.type] = payload.file;
  introStore.preview[payload.type] = URL.createObjectURL(payload.file);
}

function handleUpdateContactForm(value: {
  socials: boolean;
  freelance: boolean;
}) {
  (introStore.form.showContactForm as any) = value;
}

async function handleSave(payload: {
  name: string;
  description: string;
  socials: Array<{ platform: string; url: string; iconName: string }>;
}) {
  introStore.form.name = payload.name;
  introStore.form.description = payload.description;
  introStore.form.socials = payload.socials;
  introStore.setSaving(true);
  try {
    await introController.saveIntro(introStore.form, {
      logo: introStore.files.logo || undefined,
      photo: introStore.files.photo || undefined,
      ...Object.fromEntries(
        Object.entries(introStore.sectionFiles.stack).map(([k, v]) => [`stack_image_${k}`, v])
      ),
    });
  } finally {
    introStore.setSaving(false);
  }
}

onMounted(async () => {
  introStore.setLoading(true);
  try {
    const data = await introController.loadIntro();
    introStore.setData(data);
  } finally {
    introStore.setLoading(false);
  }
});
</script>
