<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start" :mode="designPlatform">
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
          <ion-card class="no-shadow shadow-1">
            <ion-card-content>
              <ion-item class="transparent">
                <ion-label>Donación</ion-label>
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
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  isPlatform,
  modalController,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";

const pageTitle = "Contribuir";
const designPlatform = isPlatform("ios") ? "ios" : "md";

// functions
function closeModal() {
  modalController.dismiss();
}
</script>
