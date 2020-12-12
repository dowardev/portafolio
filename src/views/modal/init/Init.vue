<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button v-on:click="cerrarModal()">
          <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>Init</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>
      Init es un emprendimiento por parte de Juan Villalvazo para entregar todo
      tipo de contenido audiovisual de forma gratuita a todo aquel que lo
      necesite.<br />
      Para mas información visita mi sitio Web donde lo explico de forma mas
      detallada.
    </p>
    <br />
    <ion-router-link
      v-on:click="
        navegador('https://www.youtube.com/channel/UCjZaahWWnibfqSlJWxdU28g')
      "
      >Canal de youtube de Init</ion-router-link
    >
    <br />
    <p>Videos en los que participo:</p>
    <br />
    <ion-list>
      <ion-item>
        <ion-label>
          <ion-router-link
            v-on:click="
              navegador('https://www.youtube.com/watch?v=yzcMPqOHu7c')
            "
            >Creacion de sitios web SPA con autenticacion usando Vue 2 y Laravel
            7</ion-router-link
          >
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>
          <ion-router-link
            v-on:click="
              navegador('https://www.youtube.com/watch?v=wXqYgStlfKI')
            "
            >Proteger rutas de Vue y Laravel</ion-router-link
          >
        </ion-label>
      </ion-item>
    </ion-list>
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