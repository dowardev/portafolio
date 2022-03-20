<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          {{ pageTitle }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <h1>{{ pageTitle }}</h1>
        </ion-toolbar>
      </ion-header>

      <ion-row>
        <ion-col
          size-md="6"
          size-sm="12"
          size="12"
          v-for="(habilidad, indexHabilidad) in skills[0].tipo"
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
                  <img
                    :src="technology.image[0].path"
                    :style="{
                      maxWidth: technology.image[0].size,
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
} from "@ionic/vue";
import { defineComponent } from "vue";

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
  },
  data() {
    return {
      pageTitle: "Conocimientos",
      skills: [
        {
          tipo: [
            {
              name: "Tecnologías",
              technology: [
                {
                  name: "Html",
                  image: [
                    {
                      path: require("../../../public/assets/otros/html-1.svg"),
                      size: "24px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "Css",
                  image: [
                    {
                      path: require("../../../public/assets/otros/css-3.svg"),
                      size: "24px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "JavaScript",
                  image: [
                    {
                      path: require("../../../public/assets/otros/logo-javascript.svg"),
                      size: "27px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "Php",
                  image: [
                    {
                      path: require("../../../public/assets/otros/php-1.svg"),
                      size: "51px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "GraphQL",
                  image: [
                    {
                      path: require("../../../public/assets/otros/GraphQL.svg"),
                      size: "27px",
                      color: "red",
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
                  image: [
                    {
                      path: require("../../../public/assets/otros/angular-icon-1.svg"),
                      size: "25px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "Electron",
                  image: [
                    {
                      path: require("../../../public/assets/otros/electron-1.svg"),
                      size: "25px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "Ionic",
                  image: [
                    {
                      path: require("../../../public/assets/otros/ionicframework-icon.svg"),
                      size: "27px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "Vue",
                  image: [
                    {
                      path: require("../../../public/assets/otros/vue-js-1.svg"),
                      size: "31px",
                    },
                  ],
                },
                {
                  name: "Laravel",
                  image: [
                    {
                      path: require("../../../public/assets/otros/laravel-2.svg"),
                      size: "26px",
                    },
                  ],
                },
              ],
            },
            {
              name: "Bases de datos",
              technology: [
                {
                  name: "Firebase",
                  image: [
                    {
                      path: require("../../../public/assets/otros/Firebase_Logo_Logomark.svg"),
                      size: "22px",
                    },
                  ],
                },
                {
                  name: "Mysql",
                  image: [
                    {
                      path: require("../../../public/assets/otros/mysql-6.svg"),
                      size: "29px",
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
                      path: require("../../../public/assets/otros/git-icon.svg"),
                      size: "30px",
                      color: "red",
                    },
                  ],
                },
                {
                  name: "Linux",
                  image: [
                    {
                      path: require("../../../public/assets/otros/linux-tux-2.svg"),
                      size: "30px",
                      color: "red",
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
