<template>
  <ion-page>
    <ion-content>
      <!-- skills -->
      <section class="ion-padding">
        <h2>Conocimientos</h2>
        <ion-grid>
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
                  <ion-card-title>{{ habilidad.nombre }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-row style="text-align: center;">
                    <ion-col
                      v-for="(tecnologia, index) in habilidad.tecnologia"
                      :key="index"
                      style="cursor: pointer;"
                    >
                      <ion-icon
                        v-if="tecnologia.icono"
                        :icon="tecnologia.icono[0].nombre"
                        :style="{
                          fontSize: tecnologia.icono[0].size,
                        }"
                      ></ion-icon>
                      <img
                        v-else
                        :src="tecnologia.imagen[0].ruta"
                        :style="{
                          width: tecnologia.imagen[0].size,
                        }"
                      />
                      <p>{{ tecnologia.nombre }}</p>
                    </ion-col>
                  </ion-row>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </section>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from "@ionic/vue";
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
  components: { IonPage, IonContent },
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
              nombre: "Tecnologias",
              tecnologia: [
                {
                  nombre: "Html",
                  icono: [{ nombre: logoHtml5, size: "24px" }],
                },
                {
                  nombre: "Css",
                  icono: [{ nombre: logoCss3, size: "24px" }],
                },
                {
                  nombre: "JavaScript",
                  icono: [{ nombre: logoJavascript, size: "24px" }],
                },
                {
                  nombre: "Php",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/php.svg"),
                      size: "24px",
                    },
                  ],
                },
              ],
            },
            {
              nombre: "Frameworks",
              tecnologia: [
                {
                  nombre: "Angular",
                  icono: [{ nombre: logoAngular, size: "24px" }],
                },
                {
                  nombre: "Bootstrap",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/Bootstrap.svg"),
                      size: "24px",
                    },
                  ],
                },
                {
                  nombre: "Electron",
                  icono: [{ nombre: logoElectron, size: "24px" }],
                },
                {
                  nombre: "Ionic",
                  icono: [{ nombre: logoIonic, size: "24px" }],
                },
                {
                  nombre: "Vue",
                  icono: [{ nombre: logoVue, size: "24px" }],
                },
                {
                  nombre: "Vuetify",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/vuetify.svg"),
                      size: "24px",
                    },
                  ],
                },
                {
                  nombre: "Laravel",
                  icono: [{ nombre: logoLaravel, size: "24px" }],
                },
              ],
            },
            {
              nombre: "Bases de datos",
              tecnologia: [
                {
                  nombre: "Firebase",
                  icono: [{ nombre: logoFirebase, size: "24px" }],
                },
                {
                  nombre: "Mysql",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/mysql.svg"),
                      size: "24px",
                    },
                  ],
                },
              ],
            },
            {
              nombre: "Herramientas",
              tecnologia: [
                {
                  nombre: "Git",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/git.svg"),
                      size: "24px",
                    },
                  ],
                },
                {
                  nombre: "Linux",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/linux.svg"),
                      size: "24px",
                    },
                  ],
                },

                {
                  nombre: "Vim",
                  imagen: [
                    {
                      ruta: require("../../../public/assets/otros/vim.png"),
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
