<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>Conocimientos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col
          size-md="6"
          size-sm="12"
          size="12"
          v-for="(habilidad, indexHabilidad) in habilidades[0].tipo"
          :key="indexHabilidad"
        >
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ habilidad.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-row style="text-align: center">
                <ion-col
                  v-for="(technology, index) in habilidad.technology"
                  :key="index"
                >
                  <ion-icon
                    v-if="technology.icon"
                    :icon="technology.icon[0].name"
                    :style="{
                      fontSize: technology.icon[0].size,
                    }"
                  ></ion-icon>
                  <img
                    v-else
                    :src="technology.image[0].ruta"
                    :style="{
                      width: technology.image[0].size,
                    }"
                  />
                  <p>{{ technology.name }}</p>
                </ion-col>
              </ion-row>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
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
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  logoIonic,
  logoHtml5,
  logoVue,
  logoAngular,
  logoCss3,
  logoFirebase,
  logoJavascript,
  logoLaravel,
  logoElectron,
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
    IonMenuButton,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
  },
  setup() {
    return {
      logoIonic,
      logoHtml5,
      logoVue,
      logoAngular,
      logoCss3,
      logoFirebase,
      logoJavascript,
      logoLaravel,
      logoElectron,
    };
  },
  data() {
    return {
      habilidades: [
        {
          tipo: [
            {
              name: "Tecnología",
              technology: [
                {
                  name: "Html",
                  icon: [{ name: logoHtml5, size: "24px" }],
                },
                {
                  name: "Css",
                  icon: [{ name: logoCss3, size: "24px" }],
                },
                {
                  name: "JavaScript",
                  icon: [{ name: logoJavascript, size: "24px" }],
                },
                {
                  name: "Php",
                  image: [
                    {
                      ruta: require("../../../public/assets/otros/php.svg"),
                      size: "24px",
                    },
                  ],
                },
              ],
            },
            {
              name: "Frameworks",
              technology: [
                {
                  name: "Angular",
                  icon: [{ name: logoAngular, size: "24px" }],
                },
                {
                  name: "Electron",
                  icon: [{ name: logoElectron, size: "24px" }],
                },
                {
                  name: "Ionic",
                  icon: [{ name: logoIonic, size: "24px" }],
                },
                {
                  name: "Vue",
                  icon: [{ name: logoVue, size: "24px" }],
                },
                {
                  name: "Laravel",
                  icon: [{ name: logoLaravel, size: "24px" }],
                },
              ],
            },
            {
              name: "Bases de datos",
              technology: [
                {
                  name: "Firebase",
                  icon: [{ name: logoFirebase, size: "24px" }],
                },
                {
                  name: "Mysql",
                  image: [
                    {
                      ruta: require("../../../public/assets/otros/mysql.svg"),
                      size: "24px",
                    },
                  ],
                },
              ],
            },
            {
              name: "Herramientas",
              technology: [
                {
                  name: "Git",
                  image: [
                    {
                      ruta: require("../../../public/assets/otros/git.svg"),
                      size: "24px",
                    },
                  ],
                },
                {
                  name: "Linux",
                  image: [
                    {
                      ruta: require("../../../public/assets/otros/linux.svg"),
                      size: "24px",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
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
