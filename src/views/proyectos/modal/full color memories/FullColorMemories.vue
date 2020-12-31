<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button v-on:click="cerrarModal()">
          <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>FullColorMemories(suspendido)</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>
      Full Color Memories es un sitio Web que desarrolle como freelance en la
      plataforma de Workana. El proyecto nunca se finalizo debido a que el
      cliente así lo decidió.
    </p>
    <br />
    <p>
      La idea principal de este sitio Web es el funcionar como una plataforma
      para imprimir fotografías.
    </p>
    <br />
    <p>Esta desarrollado con Html, Bootstrap y JavaScript.</p>
    <a
      href="http://fullcolormemories.dowar.xyz"
      target="_blank"
      rel="noopener noreferrer"
      >Sitio web</a
    >
    <br />
    <a
      href="https://gitlab.com/gonzam4/pagina-web-fcm"
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
