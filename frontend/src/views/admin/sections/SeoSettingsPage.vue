<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar style="--background: var(--ion-background-color)">
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>

      <ion-title>Configuración SEO</ion-title>

      <ion-buttons slot="end">
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
        <ion-col size="12" size-md="10" size-lg="6">
          <ion-breadcrumbs>
            <ion-breadcrumb>
              <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
            </ion-breadcrumb>
            <ion-breadcrumb>SEO</ion-breadcrumb>
          </ion-breadcrumbs>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="12" size-md="10" size-lg="6">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Metadatos globales</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-input
                    label="Título del sitio"
                    label-placement="stacked"
                    :value="form.siteTitle"
                    placeholder="Dowar Blog"
                    @ion-input="form.siteTitle = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="Título que aparece en pestañas del navegador y como og:title por defecto en todas las páginas" />
                </ion-item>

                <ion-item>
                  <ion-textarea
                    label="Descripción del sitio"
                    label-placement="stacked"
                    :value="form.siteDescription"
                    placeholder="Blog personal de tecnología y desarrollo"
                    :maxlength="500"
                    :counter="true"
                    auto-grow
                    @ion-input="form.siteDescription = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="Descripción por defecto del sitio. Se usa como og:description cuando un post no tiene descripción propia. Recomendado: 150-160 caracteres." />
                </ion-item>

                <ion-item>
                  <ion-input
                    label="Keywords (separadas por comas)"
                    label-placement="stacked"
                    :value="form.siteKeywords"
                    placeholder="blog, tecnología, desarrollo"
                    @ion-input="form.siteKeywords = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="Palabras clave separadas por comas. Ej: blog, tecnología, vue, laravel" />
                </ion-item>

                <ion-item>
                  <ion-input
                    label="Idioma (lang)"
                    label-placement="stacked"
                    :value="form.langCode"
                    placeholder="es"
                    maxlength="10"
                    @ion-input="form.langCode = $event.detail.value ?? 'es'"
                  />
                  <SeoHelpButton slot="end" message="Código de idioma para el atributo html lang. Ej: es para español, en para inglés" />
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header>
              <ion-card-title>Open Graph / Twitter</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-input
                    label="og:site_name"
                    label-placement="stacked"
                    :value="form.ogSiteName"
                    placeholder="Dowar Blog"
                    @ion-input="form.ogSiteName = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="Nombre del sitio que aparece en previsualizaciones de Facebook, LinkedIn, Discord, etc" />
                </ion-item>

                <ion-item>
                  <ion-input
                    label="Twitter handle (@usuario)"
                    label-placement="stacked"
                    :value="form.twitterHandle"
                    placeholder="@dowar"
                    @ion-input="form.twitterHandle = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="Tu usuario de Twitter con @. Aparece en la tarjeta de previsualización de Twitter" />
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Imagen OG por defecto (1200x630)</ion-label>
                  <SeoHelpButton slot="end" message="Imagen por defecto para Open Graph. Recomendado: 1200x630 px, máximo 5MB, formato JPG o PNG" />
                  <div class="image-preview-container">
                    <img
                      v-if="previewImage"
                      :src="previewImage"
                      class="og-preview"
                      alt="OG preview"
                    />
                    <ion-button
                      fill="outline"
                      class="ion-margin-top"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        class="file-input"
                        @change="onImageSelected"
                      />
                      {{ form.siteImageUrl ? 'Cambiar imagen' : 'Seleccionar imagen' }}
                    </ion-button>
                    <ion-button
                      v-if="form.siteImageUrl && !newImage"
                      fill="clear"
                      color="danger"
                      size="small"
                      @click="removeImage"
                    >
                      <ion-icon slot="start" :icon="trashOutline" />
                      Eliminar
                    </ion-button>
                  </div>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header>
              <ion-card-title>Configuración técnica</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-toggle
                    :checked="form.robotsIndex"
                    @ion-change="form.robotsIndex = $event.detail.checked"
                  >
                    Permitir indexación (robots)
                  </ion-toggle>
                  <SeoHelpButton slot="end" message="Si está activo, los buscadores pueden indexar el sitio. Desactivar solo en entornos de prueba" />
                </ion-item>

                <ion-item>
                  <ion-input
                    label="Canonical base URL"
                    label-placement="stacked"
                    :value="form.canonicalBase"
                    placeholder="https://dowar.xyz"
                    @ion-input="form.canonicalBase = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="URL base canónica sin slash final. Usada para construir URLs absolutas en meta tags canonical y og:url" />
                </ion-item>

                <ion-item>
                  <ion-input
                    label="API URL para prerender (admin_api_url)"
                    label-placement="stacked"
                    :value="form.adminApiUrl"
                    placeholder="https://api.dowar.xyz"
                    @ion-input="form.adminApiUrl = $event.detail.value ?? ''"
                  />
                  <SeoHelpButton slot="end" message="URL del backend Laravel que prerender.php usará. Si está vacío, usa la variable de entorno API_URL del servidor" />
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
  </ion-page>
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonRow,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import { ref, reactive, onMounted } from "vue";
import SeoSettingsController from "@/controllers/seoSettingsController";
import SeoHelpButton from "@/components/admin/SeoHelpButton.vue";
import { saveOutline, trashOutline, helpCircleOutline } from "ionicons/icons";

const seoSettingsController = new SeoSettingsController();
const saving = ref(false);

const form = reactive({
  siteTitle: "",
  siteDescription: "",
  siteKeywords: "",
  langCode: "es",
  ogSiteName: "",
  twitterHandle: "",
  siteImageUrl: null as string | null,
  robotsIndex: true,
  canonicalBase: "",
  adminApiUrl: "",
});

const previewImage = ref<string | null>(null);
const newImage = ref<File | null>(null);

onMounted(async () => {
  const settings = await seoSettingsController.loadSettings();
  applySettings(settings);
});

function applySettings(settings: Record<string, any>) {
  form.siteTitle = settings.siteTitle ?? "";
  form.siteDescription = settings.siteDescription ?? "";
  form.siteKeywords = settings.siteKeywords ?? "";
  form.langCode = settings.langCode ?? "es";
  form.ogSiteName = settings.ogSiteName ?? "";
  form.twitterHandle = settings.twitterHandle ?? "";
  form.siteImageUrl = settings.siteImageUrl ?? null;
  form.robotsIndex = settings.robotsIndex ?? true;
  form.canonicalBase = settings.canonicalBase ?? "";
  form.adminApiUrl = settings.adminApiUrl ?? "";
}

function onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  newImage.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  newImage.value = null;
  previewImage.value = null;
  form.siteImageUrl = null;
}

async function handleSave() {
  saving.value = true;
  try {
    await seoSettingsController.saveSettings({
      settings: {
        siteTitle: form.siteTitle || null,
        siteDescription: form.siteDescription || null,
        siteKeywords: form.siteKeywords || null,
        langCode: form.langCode || "es",
        ogSiteName: form.ogSiteName || null,
        twitterHandle: form.twitterHandle || null,
        robotsIndex: form.robotsIndex,
        canonicalBase: form.canonicalBase || null,
        adminApiUrl: form.adminApiUrl || null,
      },
      image: newImage.value ?? undefined,
    });
    newImage.value = null;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-top: 8px;
}

.og-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 8px;
  object-fit: cover;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  top: 0;
  left: 0;
}
</style>