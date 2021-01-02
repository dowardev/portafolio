<template>
  <ion-content class="contenido-proyectos">
    <div id="div-proyectos">
      <!-- proyectos -->
      <section class="ion-padding">
        <h2>Proyectos</h2>
        <ion-row>
          <ion-col size="auto">
            <ion-card v-on:click="modalGlobalizaciones" class="fancy_card">
              <img
                src="../../../public/assets/otros/globtec.webp"
                alt=""
                class="img-proyecto"
                style="max-width: 196px;"
              />
              <ion-card-header>
                <ion-card-title>Globalizaciones</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card v-on:click="modalFullColorMemories" class="fancy_card">
              <img
                src="../../../public/assets/otros/color.png"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Full Color Memories</ion-card-title>
                <ion-card-subtitle>Sitio web</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card v-on:click="modalAgendaris" class="fancy_card">
              <img
                src="../../../public/assets/otros/agendaris.jpg"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Agendaris</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card v-on:click="modalMaxvie" class="fancy_card">
              <img
                src="../../../public/assets/otros/maxvie.png"
                alt=""
                class="img-proyecto"
                style="max-width: 196px;"
              />
              <ion-card-header>
                <ion-card-title>Maxvie</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <!-- otras participaciones -->
      <section class="ion-padding">
        <h2>Otras participaciones</h2>
        <ion-row>
          <ion-col size="auto">
            <ion-card
              class="fancy_card"
              v-on:click="
                navegador(
                  'https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c?ref=user_dropdown'
                )
              "
            >
              <ion-row>
                <ion-col>
                  <img
                    src="../../../public/assets/otros/workana.png"
                    alt=""
                    class="img-proyecto"
                /></ion-col>
              </ion-row>
              <ion-card-header>
                <ion-card-title>Freelance de sitios web</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card v-on:click="modalInit" class="fancy_card">
              <img
                src="../../../public/assets/otros/init.png"
                alt=""
                style="width: 134px"
              />
              <ion-card-header>
                <ion-card-title>Colaborador de contenido</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>
    </div>
  </ion-content>
</template>

<script lang="ts">
import { IonContent, modalController } from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;

import Globalizaciones from "./modal/globalizaciones/Globalizaciones.vue";
import FullColorMemories from "./modal/full color memories/FullColorMemories.vue";
import Init from "./modal/init/Init.vue";
import Agendaris from "./modal/agendaris/Agendaris.vue";
import Maxvie from "./modal/maxvie/Maxvie.vue";

export default defineComponent({
  components: { IonContent },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    async modalGlobalizaciones() {
      const modal = await modalController.create({
        component: Globalizaciones,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalFullColorMemories() {
      const modal = await modalController.create({
        component: FullColorMemories,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalInit() {
      const modal = await modalController.create({
        component: Init,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalAgendaris() {
      const modal = await modalController.create({
        component: Agendaris,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalMaxvie() {
      const modal = await modalController.create({
        component: Maxvie,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
  },
});
</script>

<style>
/* img {
  display: block;
  margin-left: auto;
  margin-right: auto;
} */
.contenido-proyectos {
  height: 92rem;
}
@media (min-width: 992px) {
  .img-proyecto {
    max-width: 196px;
  }
  .contenido-proyectos {
    height: 51rem;
  }
}
ion-card-title {
  --color: #909090;
}

/* movil vertical */
@media (min-width: 320px) and (max-width: 480px) {
  /*  #div-proyectos {
    height: 147rem;
  } */
  /*  @supports (-webkit-touch-callout: none) {
    #div-proyectos {
      height: 160rem;
    }
  }
  @supports not (-webkit-touch-callout: none) {
    #div-proyectos {
      height: 160rem;
    }
  } */
}
/* movil horizontal */
/* @media (min-width: 481px) and (max-width: 767px) {
  #div-proyectos {
    height: 160rem;
  }
} */
/* iPhone X, XS, 11 Pro vertical */
/* @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (device-aspect-ratio: 375/812) {
  #div-proyectos {
    height: 150rem;
  }
} */
/* iPhone X, XS, 11 Pro horinzontal */
/* @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (device-aspect-ratio: 812/375) {
  #div-proyectos {
    height: 142rem;
  }
} */
/* iPhone XS Max, 11 Pro Max vertical */
/* @media only screen and (min-device-width: 414px) and (max-device-width: 896px) and (-webkit-min-device-pixel-ratio: 3) and (device-aspect-ratio: 414/896) {
  #div-proyectos {
    height: 147rem;
  }
} */
/* iPhone XS Max, 11 Pro Max horizontal */
/* @media only screen and (min-device-width: 414px) and (max-device-width: 896px) and (-webkit-min-device-pixel-ratio: 3) and (device-aspect-ratio: 896/414) {
  #div-proyectos {
    height: 140rem;
  }
} */
/* iPhone 6, 6S, 7, 8 vertical */
/* @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: portrait) and (device-aspect-ratio: 375/667) and (-webkit-min-device-pixel-ratio: 2) {
  #div-proyectos {
    height: 160rem;
  }
} */
/* iPhone 6, 6S, 7, 8 horizontal */
/* @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (device-aspect-ratio: 667/375) and (-webkit-min-device-pixel-ratio: 2) {
  #div-proyectos {
    height: 171rem;
  }
} */
/* iPhone 6 Plus, 6S Plus, 7 Plus, 8 Plus vertical */
/* @media only screen and (min-width: 414px) and (max-width: 736px) and (device-aspect-ratio: 414/736) and (-webkit-min-device-pixel-ratio: 3) {
  #div-proyectos {
    height: 156rem;
  }
} */
/* iPhone 6 Plus, 6S Plus, 7 Plus, 8 Plus horizontal */
/* @media only screen and (min-width: 414px) and (max-width: 736px) and (device-aspect-ratio: 736/414) and (-webkit-min-device-pixel-ratio: 3) {
  #div-proyectos {
    height: 169rem;
  }
} */
/* iPhone 5, 5C, 5S, SE vertical */
/* @media only screen and (min-width: 320px) and (max-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (device-aspect-ratio: 320/568) {
  #div-proyectos {
    height: 171rem;
  }
} */
/* iPhone 5, 5C, 5S, SE horinzontal */
/* @media only screen and (min-width: 320px) and (max-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (device-aspect-ratio: 568/320) {
  #div-proyectos {
    height: 175rem;
  }
} */
/* escritorio */
/* @media (min-width: 1025px) and (max-width: 1280px) {
  #div-proyectos {
    height: 56rem;
  }
} */
/* laptops */
/* @media (min-width: 1281px) {
  #div-proyectos {
    height: 56rem;
  }
} */

/* tarjetas */
.fancy_card {
  border-radius: 5px;
  box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
    1px 3px 8px rgba(39, 44, 49, 0.03);
  overflow: hidden;
  /* otherwise header image won't respect rounded corners */
  background: #0a151f;
  transition: all 0.5s ease;
  /* back to normal */
}
.fancy_card:hover {
  transform: translate3D(0, -1px, 0) scale(1.03);
  /* move up slightly and zoom in */
  box-shadow: 8px 28px 50px rgba(39, 44, 49, 0.07),
    1px 6px 12px rgba(39, 44, 49, 0.04);
  transition: all 0.4s ease;
  /* zoom in */
  cursor: pointer;
}
</style>
