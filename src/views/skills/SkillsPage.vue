<template>
  <ion-row>
    <ion-col>
      <ion-row>
        <ion-col style="display: flex" class="ion-justify-content-center">
          <h1>Stack principal</h1>
        </ion-col>
      </ion-row>

      <ion-row class="sec2">
        <ion-col style="display: flex" class="ion-justify-content-center">
          <ion-row
            style="display: flex; justify-content: space-between; width: 40%"
          >
            <ion-col size="auto">
              <img :src="vueLogo" alt="" />
            </ion-col>

            <ion-col size="auto">
              <img :src="laravelLogo" alt="" />
            </ion-col>

            <ion-col size="auto">
              <img :src="mysqlLogo" alt="" />
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col
      v-for="(skill, indexSkill) in skills[0].tipo"
      :key="indexSkill"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card class="shadow-1">
        <ion-card-header>
          <ion-card-title>{{ skill.name }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-row style="text-align: center">
            <ion-col
              v-for="(technology, index) in skill.technology"
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
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";
import { ref } from "vue";

// multimedia
// imgs
import htmlLogo from "../../assets/otros/html-1.svg";
import cssLogo from "../../assets/otros/css-3.svg";
import javascriptLogo from "../../assets/otros/logo-javascript.svg";
import phpLogo from "../../assets/otros/php-1.svg";
import graphqlLogo from "../../assets/otros/GraphQL.svg";
import angularLogo from "../../assets/otros/angular-icon-1.svg";
import electronLogo from "../../assets/otros/electron-1.svg";
import ionicLogo from "../../assets/otros/ionicframework-icon.svg";
import vueLogo from "../../assets/otros/vue-js-1.svg";
import laravelLogo from "../../assets/otros/laravel-2.svg";
import firebaseLogo from "../../assets/otros/Firebase_Logo_Logomark.svg";
import mysqlLogo from "../../assets/otros/mysql-6.svg";
import gitLogo from "../../assets/otros/git-icon.svg";
import tuxLogo from "../../assets/otros/linux-tux-2.svg";
import viteLogo from "../../assets/otros/vite-color.svg";
import piniaLogo from "../../assets/otros/pinia.svg";

const emits = defineEmits(["scrollPosition"]);

const skills = ref([
  {
    tipo: [
      {
        name: "Desarrollo movil",
        technology: [
          {
            name: "Ionic",
            image: [
              {
                path: ionicLogo,
                size: "24px",
              },
            ],
          },
          {
            name: "Electon",
            image: [
              {
                path: electronLogo,
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
            name: "Vue",
            image: [
              {
                path: vueLogo,
                size: "31px",
              },
            ],
          },
          {
            name: "Laravel",
            image: [
              {
                path: laravelLogo,
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
                path: firebaseLogo,
                size: "22px",
              },
            ],
          },
          {
            name: "Mysql",
            image: [
              {
                path: mysqlLogo,
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
            name: "Linux",
            image: [
              {
                path: tuxLogo,
                size: "30px",
              },
            ],
          },
          {
            name: "Pinia",
            image: [
              {
                path: piniaLogo,
                size: "20px",
              },
            ],
          },
        ],
      },
    ],
  },
]);
</script>

<style scoped>
.sec2 img {
  width: 80px;
}
</style>
