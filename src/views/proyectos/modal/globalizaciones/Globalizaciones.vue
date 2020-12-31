<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button v-on:click="cerrarModal()">
          <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>Globalizaciones web(en desarrollo)</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>
      Globalizaciones es mi sitio Web principal y mi mas grande proyecto, con el
      quiero ofrecer contenido(videos, cursos, consejos, etc) a todo aquel que
      lo necesite para ayudarlo durante su camino como desarrollador.
    </p>
    <br />
    <p>
      Esta desarrollado con Vue, Ionic y Laravel, el haber implementado Ionic le
      ofrece al usuario final la posibilidad de acceder a nuestro contenido
      desde cualquier dispositivo.
    </p>
    <a href="http://globalizaciones.dowar.xyz" target="_blank">Sitio web</a>
    <br />
    <a
      href="https://gitlab.com/gonzam4/globalizaciones-web-front"
      target="_blank"
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
