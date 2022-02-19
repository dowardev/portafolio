<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button v-on:click="closeModal()">
            <ion-icon slot="start" :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ datosProyecto.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <section v-if="datosProyecto.technologies">
        <ion-row>
          <ion-col size="12" class="ion-padding">
            <p style="font-size: 19px">
              {{ datosProyecto.description }}
            </p>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <ion-row>
              <ion-col size="12">
                <p style="text-align: left; font-size: 17px">Tecnologías</p>
              </ion-col>
              <ion-col size="12">
                <ion-item
                  :href="technology.route"
                  target="_blank"
                  lines="none"
                  v-for="technology in datosProyecto.technologies"
                  :key="technology"
                >
                  <ion-icon slot="start" :icon="technology.icon"></ion-icon>
                  <ion-label>{{ technology.name }}</ion-label>
                  <p slot="end">{{ technology.type }}</p>
                </ion-item>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="12">
                <p style="text-align: left; font-size: 17px">Mas información</p>
                <ion-button
                  fill="clear"
                  v-if="datosProyecto.page"
                  v-on:click="abrirPagina(datosProyecto.page)"
                >
                  <ion-icon :icon="globeOutline"></ion-icon>
                </ion-button>
                <ion-button
                  fill="clear"
                  v-if="datosProyecto.playstore"
                  v-on:click="abrirPagina(datosProyecto.playstore)"
                >
                  <ion-icon :icon="logoGooglePlaystore"></ion-icon>
                </ion-button>
                <ion-button
                  fill="clear"
                  v-if="datosProyecto.repository"
                  v-on:click="abrirPagina(datosProyecto.repository)"
                >
                  <ion-icon :icon="codeSlashOutline"></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
  IonButtons,
  IonIcon,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;
import {
  chevronBackOutline,
  logoIonic,
  logoFirebase,
  logoPaypal,
  globeOutline,
  logoGooglePlaystore,
  codeSlashOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
  },
  props: {
    project: { type: Array<any>(), default: {} },
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
  data() {
    return {
      datosProyecto: {
        name: "",
        description: "",
        technologies: Array<any>(),
        page: "",
        repository: "",
        playstore: "",
      },
    };
  },
  mounted() {
    this.datosProyecto.name = this.project.name;
    this.datosProyecto.description = this.project.description;
    this.datosProyecto.technologies = this.project.technologies;
    this.datosProyecto.page = this.project.page;
    this.datosProyecto.repository = this.project.repository;
    this.datosProyecto.playstore = this.project.playstore;
  },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    cerrarModal() {
      modalController.dismiss();
    },
    async abrirPagina(page: string) {
      window.open(page, "_blank");
    },
    closeModal() {
      modalController.dismiss();
    },
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
