<template>
  <ion-row style="overflow: auto; max-height: calc(100% - 8dvh)">
    <ion-col
      v-for="(certificate, index) in certificates"
      :key="index"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card
        class="shadow-1"
        style="cursor: pointer"
        @click="
          openUrl({
            url: certificate.url,
          })
        "
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
                style="display: flex; align-items: center; margin-right: 10px"
              >
                <img
                  v-if="tech.type === 'img'"
                  :src="tech.source"
                  :alt="tech.name"
                  :style="{ width: tech.size }"
                />

                <ion-icon
                  v-if="tech.type == 'icon'"
                  :style="{
                    fontSize: tech.size,
                    color: getIconColor(tech.source),
                  }"
                  :icon="getIconSource(tech.source)"
                ></ion-icon>
              </div>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script lang="ts" setup>

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonRow,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import * as ionicons from "ionicons/icons";
import type { CertificateItem } from "@/services/types";
import { useIconColors } from "@/composables/useIconColors";
import CertificatesController from "@/controllers/certificatesController";

const { getIconColor } = useIconColors();
const certificatesController = new CertificatesController();

const certificates = ref<CertificateItem[]>([]);

onMounted(async () => {
  try {
    await certificatesController.loadPublicCertificates();
    certificates.value = certificatesController.getCertificates();
  } catch (error) {
    console.error("Error loading certificates data:", error);
  }
});

function openUrl(params: { url: string }) {
  const { url } = params;
  window.open(url, "_blank");
}

function getIconSource(source: string) {
  if (!source) return ionicons.linkOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.linkOutline;
}
</script>
