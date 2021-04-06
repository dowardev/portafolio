<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button v-on:click="cerrarModal()">
          <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ nombre }}</ion-title>
      <ion-buttons slot="end">
        <ion-button v-on:click="openPopover($event, repositorio, pagina)">
          <ion-icon :icon="ellipsisVerticalOutline"></ion-icon
        ></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <p style="font-size:19px">
      {{ descripcion }}
    </p>
    <ion-row  v-if="tecnologias"
>
       <ion-col size="12">
        <p style="text-align:left;font-size:17px">Tecnologias</p>
        <ion-item
          :href="tecnologia.ruta"
          target="_blank"
          lines="none"
          v-for="tecnologia in tecnologias"
          :key="tecnologia"
        >
          <ion-icon slot="start" :icon="tecnologia.icono"></ion-icon>
          <ion-label>{{ tecnologia.nombre }}</ion-label>
          <p slot="end">{{ tecnologia.tipo }}</p>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  popoverController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;
import { modalController } from "@ionic/vue";
import {
  arrowBackOutline,
  logoIonic,
  logoFirebase,
  logoPaypal,
  ellipsisVerticalOutline,
} from "ionicons/icons";
import OpcionesModal from "./OpcionesModal.vue";

export default defineComponent({
  name: "Petstread",
  props: {
    nombre: { type: String, default: "Super Modal" },
    descripcion: { type: String, default: "Super Modal" },
    tecnologias: {type:Object },
    pagina: { default: null },
    repositorio: { default: null },
  },
  data() {
    return {};
  },
  setup() {
    return {
      arrowBackOutline,
      logoIonic,
      logoFirebase,
      logoPaypal,
      ellipsisVerticalOutline,
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
    async openPopover(ev: Event, repositorio: any, pagina: any) {
      const popover = await popoverController.create({
        component: OpcionesModal,
        cssClass: "my-custom-class",
        event: ev,
        translucent: true,
        componentProps: {
          repositorio,
          pagina,
        },
      });
      popover.onDidDismiss().then((data) => {
        if (data.data != undefined) {
          if (data.data.opcion == "repositorio") {
            window.open(this.repositorio, "_blank");
          }
          if (data.data.opcion == "pagina") {
            window.open(this.pagina, "_blank");
          }
        }
      });
      return popover.present();
    },
  },
});
</script>

<style scoped>
ion-item {
  --background: #1c1c26;
}
</style>
