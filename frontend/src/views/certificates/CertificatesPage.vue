<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start" :mode="designMode">
        <ion-menu-button menu="mainMenu" :mode="designMode"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-row
      class="ion-justify-content-center"
      style="display: flex; overflow: auto; max-height: calc(100% - 8dvh)"
    >
      <ion-col size-xs="12" size-sm="8" size-lg="6">
        <ion-row>
          <ion-col
            v-for="(certificate, indexCertificate) in certificates"
            :key="indexCertificate"
            size-xs="12"
            size-md="6"
            size-lg="6"
          >
            <ion-card
              class="shadow-1"
              style="cursor: pointer"
              @click="openUrl(certificate.url)"
            >
              <ion-card-header>
                <div style="display: flex; justify-content: space-between">
                  <img :src="certificate.img" alt="" style="height: 45px" />
                </div>

                <ion-card-title>
                  {{ certificate.title }}
                </ion-card-title>
              </ion-card-header>

              <ion-card-content>
                <ion-row>
                  <ion-col size="10" style="display: flex">
                    <div
                      v-for="(tech, techIndex) in certificate.aptitudes"
                      :key="techIndex"
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                      "
                    >
                      <img
                        v-if="tech.type === 'img'"
                        :src="tech.source"
                        :alt="tech.name"
                        :style="{ width: tech.size }"
                      />

                      <ion-icon
                        v-if="tech.type === 'icon'"
                        :style="{
                          fontSize: tech.size,
                          color: getIconColor(tech.source),
                        }"
                        :icon="getIconByName(tech.source)"
                      ></ion-icon>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">

import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import * as ionicons from "ionicons/icons";

import { DesignMode } from "@/utils/types";
import SystemController from "@/controllers/systemController";
import type { CertificateItem } from "@/services/types";
import CertificatesController from "@/controllers/certificatesController";
import { useIconColors } from "@/composables/useIconColors";

const { getIconColor } = useIconColors();
const certificatesController = new CertificatesController();

const systemController = new SystemController();

const designMode = ref<DesignMode>(systemController.getdesignMode());
const pageTitle = "Certificados";
const certificates = ref<CertificateItem[]>([]);

onMounted(async () => {
  try {
    await certificatesController.loadPublicCertificates();
    certificates.value = certificatesController.getCertificates();
  } catch (error) {
    console.error("Error loading certificates data:", error);
  }
});

function openUrl(url: string) {
  window.open(url, "_blank");
}

function getIconByName(source: string) {
  if (!source) return ionicons.helpCircleOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.helpCircleOutline;
}
</script>

<style scoped>
</style>
