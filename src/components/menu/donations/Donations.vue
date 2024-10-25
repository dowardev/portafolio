<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button class="close-button" @click="closeModal()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="center">
        <ion-col size="12">
          <ion-card>
            <ion-card-content>
              <ion-item class="transparent">
                <ion-label>Donacion</ion-label>
                <a href="https://liberapay.com/dowar/donate" target="_blank">
                  <img
                    alt="Donate using Liberapay"
                    src="https://liberapay.com/assets/widgets/donate.svg"
                  />
                </a>
              </ion-item>

              <ion-item class="transparent">
                <ion-label class="ion-text-wrap"
                  >Usando el codigo promocional de Hostinger</ion-label
                >
                <ion-label slot="end">1JESUSGONZA24</ion-label>
              </ion-item>

              <ion-item class="transparent">
                <ion-label>Compartir el blog</ion-label>
              </ion-item>

              <ion-item class="transparent">
                <ion-label>Reportar errores</ion-label>
              </ion-item>

              <ion-item class="transparent">
                <ion-label>Mejorar el codigo</ion-label>
              </ion-item>
            </ion-card-content>
          </ion-card>
          <p class="ion-padding">
            Sea cual sea la forma en la que me puedas ayudar, ten por seguro que
            la comunidad y yo te estaremos eternamente agradecidos porque con tu
            aportación ayudaras a que pueda crear más y mejor contenido.
          </p>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  modalController,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";

const pageTitle = "Contribuir";

// functions
function closeModal() {
  modalController.dismiss();
}
</script>
