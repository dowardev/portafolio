<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Certificados</ion-title>

        <ion-buttons slot="end">
          <ion-button color="primary" @click="createNewCertificate">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="4">
            <ion-breadcrumbs>
              <ion-breadcrumb>
                <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
              </ion-breadcrumb>

              <ion-breadcrumb>Certificados</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <template v-if="certificates.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(cert, index) in certificates"
                    :key="index"
                    button
                    lines="full"
                    @click="editCertificate(index)"
                  >
                    <ion-thumbnail v-if="cert.img" slot="start">
                      <ion-img :src="cert.img" />
                    </ion-thumbnail>

                    <ion-thumbnail
                      v-else
                      slot="start"
                      class="placeholder-thumb"
                    >
                      <ion-icon :icon="ribbonOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ cert.title || "Sin título" }}</h2>

                      <p
                        style="font-size: 12px; color: var(--ion-color-medium)"
                      >
                        {{ cert.url || "Sin link" }}
                      </p>
                    </ion-label>

                    <ion-buttons slot="end">
                      <ion-button
                        color="danger"
                        fill="clear"
                        @click.stop="confirmDelete(index)"
                      >
                        <ion-icon :icon="trashOutline" />
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-card>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>

      <div v-else class="empty-state">
        <ion-icon :icon="ribbonOutline" size="large" />

        <p>No hay certificados aún</p>

        <ion-button @click="createNewCertificate">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primer certificado
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonCard,
  alertController,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { addOutline, ribbonOutline, trashOutline } from "ionicons/icons";
import CertificatesController from "@/controllers/certificatesController";
import type { CertificateItem } from "@/services/types";

const router = useRouter();
const certificatesController = new CertificatesController();

const certificates = ref<CertificateItem[]>([]);

onMounted(async () => {
  certificates.value = await certificatesController.loadPublicCertificates();
});

function editCertificate(index: number) {
  router.push(`/admin-panel/certificates/edit/${index}`);
}

function createNewCertificate() {
  router.push("/admin-panel/certificates/new");
}

async function confirmDelete(index: number) {
  const cert = certificates.value[index];
  if (!cert?.id) return;

  const alert = await alertController.create({
    header: "Eliminar certificado",
    message: `¿Estás seguro de eliminar "${cert.title || "este certificado"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteCertificate(cert.id);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteCertificate(id: string) {
  await certificatesController.deleteCertificate(id);
}
</script>

<style scoped>
.placeholder-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--ion-color-medium);
}
</style>

