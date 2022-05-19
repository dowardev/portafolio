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
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row class="ion-padding">
        <ion-col size="12">
          <p>
            Soy desarrollador especializado en la creación de aplicaciones
            multiplataforma usando tecnologías web, tengo {{ edad }} años de
            edad y a continuación te contaré un poco más sobre mi historia.
            <br />
            Inicie con en el desarrollado de sitios Web en el año 2016 donde
            empecé con las tres tecnologías básicas HTML, CSS y JavaScript, por
            motivos de seguir con mis estudios deje un poco de lado esto y no
            fue hasta el 2018 donde lo retome, pero esta vez introduciéndome al
            BackEnd con Laravel, con el paso del tiempo fui aprendiendo otras
            tecnologías FrontEnd como Materialize y Bootstrap.
            <br />
            En el 2020 decidí emprender como freelance en la plataforma de
            Workana, con el pasar del tiempo fui adquiriendo otras habilidades
            como Vue y Angular.
            <br />
            A mediados del 2020 comencé a trabajar con Ionic lo cual me
            permitiría desarrollar aplicaciones multiplataforma(PWA, Android,
            iOS), al mismo tiempo me permitía pulir mis conocimientos con los
            Frameworks Vue y Angular.
            <br />
            Otros conocimientos que he adquirido a lo largo del tiempo son el
            manejo de sistemas operativos Linux, Git, Python, Java y C#.
            <br />
            Todo está en nuestras mentes, tanto si crees que puedes como que no
            puedes estas en lo correcto. Henry Ford
          </p>
        </ion-col>
      </ion-row>

      <div class="timeline">
        <div class="container left">
          <ion-card>
            <ion-card-header>
              <ion-card-title> 2016 </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p class="desc-timeline">
                Inicio como desarrollador de sitios web.
              </p>
            </ion-card-content>
          </ion-card>
        </div>
        <div class="container right">
          <ion-card>
            <ion-card-header>
              <ion-card-title> 2018 </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>Nueva habilidad: Laravel</p>
            </ion-card-content>
          </ion-card>
        </div>
        <div class="container left">
          <ion-card>
            <ion-card-header>
              <ion-card-title> 2020 </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>
                Iniciativa como freelance
                <br />
                Nuevas habilidades: Vue, Angular y Ionic
                <br />
                Participación en Init
              </p>
            </ion-card-content>
          </ion-card>
        </div>
        <div class="container right">
          <ion-card>
            <ion-card-header>
              <ion-card-title> 2021 </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>Creador de contenido</p>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
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
  },
  data() {
    return {
      pageTitle: "Un poco mas de mi",
      edad: new Date().getFullYear() - new Date("1998-06-18").getFullYear(),
    };
  },
});
</script>

<style scope>
/* The actual timeline (the vertical ruler) */
.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

/* The actual timeline (the vertical ruler) */
.timeline::after {
  content: "";
  position: absolute;
  width: 6px;
  background-color: var(--secondary-color);
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -3px;
}

/* Container around content */
.container {
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
}

/* The circles on the timeline */
.container::after {
  content: "";
  position: absolute;
  width: 25px;
  height: 25px;
  right: -17px;
  background-color: white;
  border: 4px solid var(--accent-color);
  top: 15px;
  border-radius: 50%;
  z-index: 1;
}

/* Place the container to the left */
.left {
  left: 0;
}

/* Place the container to the right */
.right {
  left: 50%;
}

/* Add arrows to the left container (pointing right) */
.left::before {
  content: " ";
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  right: 30px;
  border: medium solid white;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent white;
}

/* Add arrows to the right container (pointing left) */
.right::before {
  content: " ";
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  left: 30px;
  border: medium solid white;
  border-width: 10px 10px 10px 0;
  border-color: transparent white transparent transparent;
}

/* Fix the circle for containers on the right side */
.right::after {
  left: -16px;
}

/* The actual content */
.content-timeline {
  padding: 20px 30px;
  background-color: #2e3440;
  position: relative;
  border-radius: 6px;
}
@media screen and (max-width: 600px) {
  /* Place the timelime to the left */
  .timeline::after {
    left: 31px;
  }

  /* Full-width containers */
  .container {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }

  /* Make sure that all arrows are pointing leftwards */
  .container::before {
    left: 60px;
    border: medium solid white;
    border-width: 10px 10px 10px 0;
    border-color: transparent white transparent transparent;
  }

  /* Make sure all circles are at the same spot */
  .left::after,
  .right::after {
    left: 15px;
  }

  /* Make all right containers behave like the left ones */
  .right {
    left: 0%;
  }
  .title-timeline,
  desc-timeline {
    color: white !important;
  }
}
</style>
