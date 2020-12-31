<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button v-on:click="cerrarModal()">
          <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>Agendaris(en desarrollo)</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>
      Agendaris es una aplicacion tipo PWA desarrollada usando Ionic Framework,
      Angular y Firebase.
    </p>
    <br />
    <p>
      El objetivo de esta aplicacion es el poder administrar los proyectos y
      compromisos de la presidencia.
    </p>
    <a
      href="https://agendaris-ded04.web.app/"
      target="_blank"
      rel="noopener noreferrer"
      >Sitio web</a
    ><br />
    <a
      href="https://gitlab.com/gonzam4/agendadis"
      target="_blank"
      rel="noopener noreferrer"
      >Repositorio</a
    >
  </ion-content>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;
import { modalController } from "@ionic/vue";
import { arrowBackOutline } from "ionicons/icons";

export default defineComponent({
  name: "Modal",
  data() {
    return {};
  },
  setup() {
    return {
      arrowBackOutline,
    };
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    cerrarModal() {
      modalController.dismiss();
    },
  },
});
</script>
