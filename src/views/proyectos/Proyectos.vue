<template>
  <ion-content class="contenido-proyectos">
    <div id="div-proyectos">
      <!-- proyectos -->
      <section class="ion-padding">
        <h2>Proyectos</h2>
        <ion-row>
          <ion-col
            size="auto"
            v-for="(proyecto, index) in proyectos"
            :key="index"
          >
            <ion-card @click="abrirModalProyectos(proyecto)" class="fancy_card">
              <ion-card-header>
                <img
                  :src="proyecto.imagen[0].ruta"
                  alt=""
                  class="img-proyecto"
                  :style="{
                    maxWidth: proyecto.imagen[0].size,
                  }"
                />
                <ion-card-subtitle>{{ proyecto.tipo }} </ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-chip :color="proyecto.color">
                  <ion-label>{{ proyecto.estado }}</ion-label>
                </ion-chip>
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
            size="auto"
            v-for="(proyecto, index) in participaciones"
            :key="index"
          >
            <ion-card @click="abrirModalProyectos(proyecto)" class="fancy_card">
              <ion-card-header>
                <img
                  :src="proyecto.imagen[0].ruta"
                  alt=""
                  class="img-proyecto"
                  :style="{
                    maxWidth: proyecto.imagen[0].size,
                  }"
                />
              </ion-card-header>
              <ion-card-content>
                <!-- <ion-card-title>{{ proyecto.nombre }}</ion-card-title>-->
                <ion-chip :color="proyecto.color">
                  <ion-label>{{ proyecto.tipo }}</ion-label>
                </ion-chip>
              </ion-card-content>
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
import Proyectos from "./modal/modalProyectos/Proyectos.vue";
import {
  arrowBackOutline,
  logoIonic,
  logoFirebase,
  logoPaypal,
  logoLaravel,
  logoVue,
  logoWordpress,
  ellipsisVerticalOutline,
} from "ionicons/icons";
export default defineComponent({
  components: { IonContent },
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
      proyectos: [
        {
          nombre: "Globalizaciones",
          estado: "En desarrollo",
          tipo: "PWA, Android, IOs",
          color: "secondary",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/globtec.webp"),
              size: "134px",
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
          repositorio: "https://gitlab.com/gonzam4/globalizaciones-web",
        },
        {
          nombre: "Petstread",
          estado: "En desarrollo",
          tipo: "Aplicacion móvil",
          color: "secondary",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/Petstread.svg"),
              size: "134px",
            },
          ],
          descripcion:
            "Petstread es una tienda de alimentos y accesorios para diversos tipos de mascotas siendo esta una aplicación para Android y IOs, el proyecto fue adquirido por medio de la plataforma de workana.El ejemplo adjunto es visualizado como un sitio web debido a que está desarrollándose  como una aplicación web por lo tanto deberá activarse la vista móvil de su navegador para su  correcta visualización.",
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
          pagina: "https://petstread.web.app/",
        },
        {
          nombre: "Thinkers",
          estado: "Finalizado",
          tipo: "Sitio web",
          color: "success",
          imagen: [
            {
              ruta: require("../../../public/assets/otros/thinkers.png"),
              size: "134px",
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
              size: "134px",
            },
          ],
          descripcion:
            "Workana es una plataforma de mercado de trabajo freelance y remoto, de contratación de trabajadores independientes. Mi labor dentro de la plataforma es el desarrollo de sitios web y aplicaciones multiplataforma",
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
              size: "134px",
            },
          ],
          descripcion:
            "Init es un emprendimiento por parte de Juan Villalvazo para entregar todo tipo de contenido audiovisual de forma gratuita a todo aquel que lo necesite.",

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
      const modal = await modalController.create({
        component: Proyectos,
        cssClass: "my-custom-class",
        componentProps: {
          nombre: datosModal.nombre,
          descripcion: datosModal.descripcion,
          tecnologias: datosModal.tecnologias,
          pagina: datosModal.pagina,
          repositorio: datosModal.repositorio,
        },
      });
      return modal.present();
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
