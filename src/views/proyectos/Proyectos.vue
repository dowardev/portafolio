<template>
  <ion-page>
    <ion-content>
      <!-- proyectos -->
      <section class="ion-padding">
        <h2>Proyectos</h2>
        <ion-row>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../../public/assets/otros/globtec.webp"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Globalizaciones</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalGlobalizaciones">
                  Ver mas
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../../public/assets/otros/color.png"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Full Color Memories</ion-card-title>
                <ion-card-subtitle>Sitio web</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalFullColorMemories">
                  Ver mas
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../../public/assets/otros/agendaris.jpg"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Agendaris</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalAgendaris">
                  Ver mas
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <!-- otras participaciones -->
      <section class="ion-padding">
        <h2>Otras participaciones</h2>
        <ion-row>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../../public/assets/otros/workana.png"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Freelance de sitios web</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-button
                  expand="block"
                  v-on:click="
                    navegador(
                      'https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c?ref=user_dropdown'
                    )
                  "
                >
                  Ver perfil
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../../public/assets/otros/init.png"
                alt=""
                style="width: 241px"
              />
              <ion-card-header>
                <ion-card-title>Colaborador de contenido</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalInit">
                  Mas informacion
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
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
  },
});
</script>

<style>
@media (min-width: 992px) {
  .img-proyecto {
    max-width: 196px;
  }
}
</style>
