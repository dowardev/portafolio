<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button v-on:click="cerrarModal()">
          <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>Globalizaciones web</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>
      Globaliaciones es mi sitio Web principal y mi mas grande proyecto, con el
      quiero ofrecer contenido de calidad a todo aquel que lo necesite para
      ayudarlo durante su camino como desarrollador.
    </p>
    <br />
    <p>
      Esta desarrollado con Vue, Ionic y Laravel, el haber implementado Ionic le
      ofrece al usuario final la posibilidad de acceder a nuestro contenido
      desde cualquier dispositivo.
    </p>
    <ion-router-link v-on:click="navegador('http://globalizaciones.dowar.xyz')"
      >Globalizaciones</ion-router-link
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