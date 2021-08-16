<template>
  <ion-page>
    <ion-content class="contenido-proyectos">
      <!-- proyectos -->
      <section>
        <h2 class="ion-padding">Proyectos</h2>
        <ion-row>
          <ion-col
            size="12"
            size-md="4"
            size-lg="3"
            v-for="(proyecto, index) in proyectos"
            :key="index"
          >
            <ion-card @click="abrirModalProyectos(proyecto)" class="fancy_card">
              <ion-card-header>
                <div class="center">
                  <img
                    :src="proyecto.imagen[0].ruta"
                    alt=""
                    :style="{
                      maxWidth: proyecto.imagen[0].width,
                      height: proyecto.imagen[0].height,
                    }"
                  />
                </div>
              </ion-card-header>
              <ion-card-content>
                <ion-row>
                  <ion-col size="12">
                    <ion-chip :color="proyecto.color">
                      <ion-label>{{ proyecto.estado }}</ion-label>
                    </ion-chip>
                  </ion-col>
                  <ion-col size="12">
                    <ion-button
                      v-for="icono in proyecto.tipo"
                      :key="icono"
                      fill="clear"
                      size="small"
                    >
                      <ion-icon :icon="icono"></ion-icon>
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <!-- Participaciones-->
      <section class="ion-padding">
        <h2>Participaciones</h2>
        <ion-row>
          <ion-col
            size="12"
            size-md="4"
            size-lg="3"
            v-for="(participacion, index) in participaciones"
            :key="index"
          >
            <ion-item button :href="participacion.pagina" target="_blank">
              <ion-label>{{ participacion.nombre }}</ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;

import Proyectos from "./proyecto/Proyecto.vue";
import {
  arrowBackOutline,
  logoIonic,
  logoFirebase,
  logoPaypal,
  logoLaravel,
  logoVue,
  logoWordpress,
  ellipsisVerticalOutline,
  logoPwa,
  logoAndroid,
  logoApple,
  globeOutline,
} from "ionicons/icons";
import eventBus from "../EventBus";

export default defineComponent({
  components: { IonPage, IonContent },
  setup() {
    return {
      arrowBackOutline,
      logoIonic,
      logoFirebase,
      logoPaypal,
      logoLaravel,
      logoVue,
      logoWordpress,
      ellipsisVerticalOutline,
      logoPwa,
      logoAndroid,
      logoApple,
      globeOutline,
      proyectos: [
        {
          nombre: "Globalizaciones",
          estado: "En desarrollo",
          tipo: [logoPwa, logoAndroid, logoApple],
          color: "secondary",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/globtec.webp"),
              width: "134px",
              height: "112px",
            },
          ],
          descripcion:
            "Globalizaciones es una aplicación multiplataforma cuyo objetivo es entregar conocimiento mediante tutoriales y cursos de tecnologia.",
          tecnologias: [
            {
              nombre: "Ionic",
              ruta: "https://ionicframework.com/",
              icono: logoIonic,
              tipo: "FrontEnd",
            },
            {
              nombre: "Vue",
              ruta: "https://vuejs.org/",
              icono: logoVue,
              tipo: "FrontEnd",
            },

            {
              nombre: "Laravel",
              ruta: "https://laravel.com/",
              icono: logoLaravel,
              tipo: "BackEnd",
            },
          ],
          pagina: "https://globalizaciones.dowar.xyz/",
        },
        {
          nombre: "Petstread",
          estado: "En desarrollo",
          tipo: [logoAndroid],
          color: "secondary",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/Petstread.svg"),
              width: "134px",
              height: "112px",
            },
          ],
          descripcion:
            "Petstread es una tienda de alimentos y accesorios para diversos tipos de mascotas siendo esta una aplicación para PWA, Android y IOs, el proyecto fue adquirido por medio de la plataforma de workana.",
          tecnologias: [
            {
              nombre: "Ionic",
              ruta: "https://ionicframework.com/",
              icono: logoIonic,
              tipo: "FrontEnd",
            },
            {
              nombre: "Firebase",
              ruta: "https://firebase.google.com/",
              icono: logoFirebase,
              tipo: "BackEnd",
            },
            {
              nombre: "Paypal",
              ruta: "https://www.paypal.com/mx/",
              icono: logoPaypal,
              tipo: "FrontEnd",
            },
          ],
          pagina: "https://petstread-ab119.web.app/inicio",
        },
        {
          nombre: "Thinkers",
          estado: "Finalizado",
          tipo: [globeOutline],
          color: "success",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/thinkers.png"),
              width: "134px",
              height: "112px",
            },
          ],
          descripcion:
            "Thinkers fue desarrollado como un landing page para una compañía de desarrolladores de software, el proyecto fue asignado como un proyecto de la plataforma de Workana.",
          tecnologias: [
            {
              nombre: "Wordpress",
              ruta: "https://es-mx.wordpress.org/",
              icono: logoWordpress,
              tipo: "CMS",
            },
          ],
          pagina: "https://thinkers.com.ec/wordpress/",
        },
      ],
      participaciones: [
        {
          nombre: "Workana",
          tipo: "Trabajo",
          color: "secondary",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/workana.png"),
              width: "189px",
              height: "82px",
            },
          ],
          pagina:
            "https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c?ref=user_dropdown",
        },
        {
          nombre: "Init",
          tipo: "Colaboracion",
          color: "secondary",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/init.png"),
              width: "134px",
              height: "82px",
            },
          ],
          pagina: "https://www.initu.me/",
        },
      ],
    };
  },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    async abrirModalProyectos(datosModal: any) {
      this.$router
        .push({
          path: "/proyecto",
        })
        .then(() => {
          eventBus().emitter.emit("datos-proyecto", {
            nombre: datosModal.nombre,
            descripcion: datosModal.descripcion,
            tecnologias: datosModal.tecnologias,
            pagina: datosModal.pagina,
            repositorio: datosModal.repositorio,
            playstore: datosModal.playstore,
          });
        });
    },
    async abrirPagina(pagina: string) {
      window.open(pagina, "_blank");
    },
  },
});
</script>

<style scope>
.center {
  display: flex;
  justify-content: center;
}
.contenido-proyectos {
  height: 92rem;
}
@media (min-width: 992px) {
  .contenido-proyectos {
    height: 51rem;
  }
}
ion-card-title {
  --color: #909090;
}
ion-item {
  --background: #0a151f;
}
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
