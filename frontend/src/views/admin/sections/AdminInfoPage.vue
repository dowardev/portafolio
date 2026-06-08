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
          @click="fillTestData"
        >
          <ion-icon :icon="bugOutline"></ion-icon>
        </ion-button>

        <ion-button
          v-tooltip="'Guardar cambios'"
          :disabled="saving"
          @click="handleSave"
        >
          <ion-spinner
            v-if="saving"
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
            :name="formData.name"
            :username="formData.username"
            :description="formData.description"
            :tags="formData.tags"
            :socials="formData.socials"
            :show-footer="formData.showFooter"
            :footer-content="formData.footerContent"
            :show-contact-form="formData.showContactForm"
            @update:name="formData.name = $event"
            @update:username="formData.username = $event"
            @update:description="formData.description = $event"
            @update:tags="formData.tags = $event"
            @update:socials="formData.socials = $event"
            @update:show-footer="formData.showFooter = $event"
            @update:footer-content="formData.footerContent = $event"
            @update:show-contact-form="formData.showContactForm = $event"
            @file-change="handleFileChange"
          />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { vTooltip } from "@/directives/tooltip";
defineOptions({
  directives: { tooltip: vTooltip },
});
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import InfoEditor from "../editors/InfoEditor.vue";
import type { TagItem } from "@/services/types";
import IntroController from "@/controllers/introController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";
import { bugOutline, saveOutline } from "ionicons/icons";

const { guard } = usePermissionGuard();

const introController = new IntroController();
const infoEditorRef = ref<InstanceType<typeof InfoEditor>>();
const isDev = import.meta.env.DEV;
const router = useRouter();
const saving = ref(false);

const formData = reactive({
  name: "",
  username: "",
  tags: [] as TagItem[],
  description: "",
  socials: [] as Array<{ platform: string; url: string; iconName: string }>,
  logoUrl: null as string | null,
  photoUrl: null as string | null,
  showFooter: true,
  footerContent: null as string | null,
  showContactForm: { socials: false, freelance: false },
});

const files = reactive({
  logo: null as File | null,
  photo: null as File | null,
});

function handleFileChange(payload: { file: File; type: "logo" | "photo" }) {
  files[payload.type] = payload.file;
}

function fillTestData() {
  formData.name = "Juan Pérez";
  formData.description =
    "Desarrollador Full-Stack con más de 5 años de experiencia en el desarrollo de aplicaciones web y móviles. Especializado en Vue.js, Laravel y bases de datos relacionales.";
  formData.socials = [
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
  formData.showContactForm = { socials: true, freelance: true };
}

async function handleSave() {
  if (!(await guard({ permission: 'intro.update' }))) {
    return;
  }

  if (!infoEditorRef?.value) return;

  const isValid = await infoEditorRef.value.handleSubmit();
  if (!isValid) return;

  saving.value = true;
  try {
    await introController.saveIntro(
      {
        name: formData.name,
        username: formData.username,
        tags: formData.tags,
        description: formData.description,
        socials: formData.socials,
        logoUrl: formData.logoUrl,
        photoUrl: formData.photoUrl,
        showFooter: formData.showFooter,
        footerContent: formData.footerContent,
        showContactForm: formData.showContactForm,
      },
      {
        logo: files.logo || undefined,
        photo: files.photo || undefined,
      }
    );
    router.push("/admin-panel");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  const data = await introController.loadIntro();
  formData.name = data.name || "";
  formData.username = data.username || "";
  formData.tags = data.tags || [];
  formData.description = data.description || "";
  formData.socials = data.socials || [];
  formData.logoUrl = data.logoUrl;
  formData.photoUrl = data.photoUrl;
  formData.showFooter = data.showFooter ?? true;
  formData.footerContent = data.footerContent ?? null;
  formData.showContactForm = data.showContactForm || { socials: false, freelance: false };
});
</script>