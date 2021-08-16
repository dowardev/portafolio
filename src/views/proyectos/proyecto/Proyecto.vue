<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button v-on:click="cerrarComponente()">
            <ion-icon slot="start" :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ datosProyecto.nombre }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-row v-if="datosProyecto.tecnologias">
        <ion-col size="12">
          <p style="font-size:19px">
            {{ datosProyecto.descripcion }}
          </p>
          <ion-row class="center">
            <ion-col size="12">
              <p style="text-align:left;font-size:17px">Tecnologias</p>
            </ion-col>
            <ion-col size="12">
              <ion-item
                :href="tecnologia.ruta"
                target="_blank"
                lines="none"
                v-for="tecnologia in datosProyecto.tecnologias"
                :key="tecnologia"
              >
                <ion-icon slot="start" :icon="tecnologia.icono"></ion-icon>
                <ion-label>{{ tecnologia.nombre }}</ion-label>
                <p slot="end">{{ tecnologia.tipo }}</p>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12">
              <p style="text-align:left;font-size:17px">Mas informacion</p>
              <ion-button
                fill="clear"
                v-if="datosProyecto.pagina"
                v-on:click="abrirPagina(datosProyecto.pagina)"
              >
                <ion-icon :icon="globeOutline" style="color:#e64e81"></ion-icon>
              </ion-button>
              <ion-button
                fill="clear"
                v-if="datosProyecto.playstore"
                v-on:click="abrirPagina(datosProyecto.playstore)"
                style="color:#e64e81"
              >
                <ion-icon :icon="logoGooglePlaystore"></ion-icon>
              </ion-button>
              <ion-button
                fill="clear"
                v-if="datosProyecto.repositorio"
                v-on:click="abrirPagina(datosProyecto.repositorio)"
                style="color:#e64e81"
              >
                <ion-icon :icon="codeSlashOutline"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
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
  chevronBackOutline,
  logoIonic,
  logoFirebase,
  logoPaypal,
  globeOutline,
  logoGooglePlaystore,
  codeSlashOutline,
} from "ionicons/icons";
import OpcionesModal from "../modal/modalProyectos/OpcionesModal.vue";
import eventBus from "../../EventBus";

export default defineComponent({
  name: "Petstread",
  components: { IonPage, IonContent, IonHeader, IonTitle, IonToolbar },
  data() {
    return {
      datosProyecto: {
        nombre: "",
        descripcion: "",
        tecnologias: "",
        pagina: "",
        repositorio: "",
        playstore: "",
      },
    };
  },
  setup() {
    return {
      chevronBackOutline,
      logoFirebase,
      logoPaypal,
      globeOutline,
      logoIonic,
      logoGooglePlaystore,
      codeSlashOutline,
    };
  },
  mounted() {
    eventBus().emitter.on("datos-proyecto", (response: any) => {
      this.datosProyecto.nombre = response.nombre;
      this.datosProyecto.descripcion = response.descripcion;
      this.datosProyecto.tecnologias = response.tecnologias;
      this.datosProyecto.pagina = response.pagina;
      this.datosProyecto.repositorio = response.repositorio;
      this.datosProyecto.playstore = response.playstore;
      eventBus().emitter.all.clear();
    });
  },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    cerrarModal() {
      modalController.dismiss();
    },
    async abrirPagina(pagina: string) {
      window.open(pagina, "_blank");
    },
    cerrarComponente() {
      this.$router.go(-1);
    },
  },
});
</script>

<style scoped>
ion-item {
  --background: #1c1c26;
}
</style>
