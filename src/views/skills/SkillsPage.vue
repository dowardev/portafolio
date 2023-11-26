<template>
  <div
    ref="mainDiv"
    style="overflow: auto; height: 100vh"
    @scroll="emitScrollPosition()"
  >
    <ion-row>
      <ion-col
        v-for="(skill, indexSkill) in skills[0].tipo"
        :key="indexSkill"
        size-xs="12"
        size-md="6"
        size-lg="12"
      >
        <ion-card
          :class="{
            'element-post-selected': elementPostHover == indexSkill,
            'element-post-no-selected': elementPostHover != indexSkill,
          }"
          class="blur-element"
          @mouseenter="elementPostHover = indexSkill"
          @mouseleave="elementPostHover = -1"
        >
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
  </div>
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
        name: "Tecnologías",
        technology: [
          {
            name: "Html",
            image: [
              {
                path: htmlLogo,
                size: "24px",
              },
            ],
          },
          {
            name: "Css",
            image: [
              {
                path: cssLogo,
                size: "24px",
              },
            ],
          },
          {
            name: "JavaScript",
            image: [
              {
                path: javascriptLogo,
                size: "27px",
              },
            ],
          },
          {
            name: "Php",
            image: [
              {
                path: phpLogo,
                size: "51px",
              },
            ],
          },
          {
            name: "GraphQL",
            image: [
              {
                path: graphqlLogo,
                size: "27px",
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
                path: angularLogo,
                size: "25px",
              },
            ],
          },
          {
            name: "Electron",
            image: [
              {
                path: electronLogo,
                size: "25px",
              },
            ],
          },
          {
            name: "Ionic",
            image: [
              {
                path: ionicLogo,
                size: "27px",
              },
            ],
          },
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
            name: "Git",
            image: [
              {
                path: gitLogo,
                size: "30px",
              },
            ],
          },
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
            name: "Vite",
            image: [
              {
                path: viteLogo,
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
const elementPostHover = ref(-1);
const mainDiv = ref();

// functions
function emitScrollPosition(): void {
  emits("scrollPosition", mainDiv.value.scrollTop);
}
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

.element-post-selected {
  border: 1px solid var(--ion-color-primary);
}

.element-post-no-selected {
  border: 1px solid var(--ion-background-color);
}
</style>
