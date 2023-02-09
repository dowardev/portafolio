<template>
  <!-- Projects -->
  <section>
    <ion-item-divider sticky style="top: 49px;">
      <ion-select v-model="typeContent" interface="popover">
        <ion-select-option value="shares">Participaciones</ion-select-option>
        <ion-select-option value="projectsB"
          >Proyectos del blog</ion-select-option
        >
        <ion-select-option value="projectsP"
          >Proyectos profesionales</ion-select-option
        >
      </ion-select>
    </ion-item-divider>

    <div class="center">
      <div v-if="typeContent=='projectsP'">
        <ProfessionalProjectsPage></ProfessionalProjectsPage>
      </div>

      <div v-if="typeContent=='shares'">
        <participationsPage></participationsPage>
      </div>

      <div v-if="typeContent=='projectsB'">
        <BloglProjectsPage></BloglProjectsPage>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {
  isPlatform,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  logoIonic,
  logoAndroid,
  browsersOutline,
  logoWindows,
  logoTux,
  serverOutline,
  logoFirefox,
  logoChrome,
  globeOutline,
  logoVue,
  logoLaravel,
} from "ionicons/icons";
import lifelineLogo from "../../assets/otros/lifeline_v1.webp";
import mariaDBLogo from "../../assets/otros/mariadb-icon.svg";
import graphqlLogo from "../../assets/otros/graphql-clear.svg";
import viteLogo from "../../assets/otros/vite.svg";

import ProfessionalProjectsPage from "../../components/portfolio/professional-projects/ProfessionalProjectsPage.vue";
import ParticipationsPage from "../../components/portfolio/participations/ParticipationsPage.vue";
import BloglProjectsPage from "../../components/portfolio/blog-projects/BlogProjectsPage.vue";

export default defineComponent({
  name: "PortfolioPage",
  components: {
    IonSelect,
    IonSelectOption,
    ProfessionalProjectsPage,
    ParticipationsPage,BloglProjectsPage
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      pageTitle: "Portfolio",
      proyectos: [
        {
          name: "Lifeline",
          status: "En desarrollo",
          type: [
            logoAndroid,
            browsersOutline,
            logoFirefox,
            logoChrome,
            logoWindows,
            logoTux,
          ],
          color: "primary",
          image: [
            {
              route: lifelineLogo,
              width: "134px",
              height: "112px",
            },
          ],
          description: "",
          technologies: [
            {
              route: "https://ionicframework.com/",
              icon: logoIonic,
              type: "icon",
            },
            {
              route: "https://vuejs.org",
              icon: logoVue,
              type: "icon",
            },
            {
              route: "https://vitejs.dev",
              icon: viteLogo,
              type: "svg",
            },
            {
              route: "https://laravel.com",
              icon: logoLaravel,
              type: "icon",
            },
            {
              route: "https://mariadb.org",
              icon: mariaDBLogo,
              type: "svg",
            },
            {
              route: "https://graphql.org",
              icon: graphqlLogo,
              type: "svg",
            },
          ],
          page: "https://lifeline.dowar.xyz",
          sourceCode: [
            {
              name: "FrontEnd",
              page: "https://gitlab.com/gonzam4/lifeline",
            },
            {
              name: "BackEnd",
              page: "https://gitlab.com/gonzam4/lifeline-backend",
            },
          ],
        },
      ],
      participaciones: [
        {
          name: "Workana",
          type: "Trabajo",
          color: "secondary",
          image: [
            {
              // route: workanaLogo,
              width: "189px",
              height: "82px",
            },
          ],
          page: "https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c?ref=user_dropdown",
        },
        {
          name: "Init",
          type: "Colaboración",
          color: "secondary",
          image: [
            {
              // route: initLogo,
              width: "134px",
              height: "82px",
            },
          ],
          page: "https://www.initu.me/",
        },
      ],
      modeDesingElements,
      serverOutline,
      browsersOutline,
      logoFirefox,
      logoChrome,
      globeOutline,
    };
  },

  data() {
    return {
      typeContent: "projectsP",
    };
  },

  methods: {
    async openPage(page: string) {
      window.open(page, "_blank");
    },
  },
});
</script>

<style scope>
/* tarjetas */
.fancy_card {
  border-radius: 5px;
  overflow: hidden;
  /* otherwise header image won't respect rounded corners */
  /*background: #2e3440;*/
  transition: all 0.5s ease;
  /* back to normal */
}
.fancy_card:hover {
  transform: translate3D(0, -1px, 0) scale(1.03);
  /* move up slightly and zoom in */
  box-shadow: 8px 28px 50px rgba(129, 161, 193, 0.07),
    1px 6px 12px rgba(129, 161, 193, 0.04);
  transition: all 0.4s ease;
  /* zoom in */
}
.card-click {
  cursor: pointer;
}
</style>
