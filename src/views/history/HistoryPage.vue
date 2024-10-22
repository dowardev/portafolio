<template>
  <ion-row>
    <ion-col size="12">
      <ion-card class="blur-effect">
        <ion-card-content>
          <p>
            Soy desarrollador especializado en la creación de aplicaciones
            multiplataforma usando tecnologías web, tengo {{ edad }} años de
            edad y a continuación te contaré un poco más sobre mi historia.
            <br />
            Inicie con en el desarrollado de sitios Web en el año 2016 donde
            empecé con las tres tecnologías básicas HTML, CSS y JavaScript, por
            motivos de seguir con mis estudios dejé un poco de lado esto y no
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
            Durante el año 2021 seguí trabajando como freelance en la plataforma
            de Workana, pero decidí hacer una pausa para trabajar en mis
            proyectos personales, además de seguir puliendo mis habilidades, así
            fue como en el año 2022 pase de trabajar con Api-Rest a GraphQL
            conocimiento el cual integre en el blog que empece a desarrollar
            durante este mismo año.
            <br />
            Tengo la firme creencia en que nuestros pensamientos tienen una
            fuerte influencia sobre nosotros y la siguiente frase lo define
            perfectamente:
            <br />
            Todo está en nuestras mentes, tanto si crees que puedes como que no
            puedes estás en lo correcto. Henry Ford
          </p>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>

  <div class="timeline">
    <div class="container left">
      <ion-card class="blur-element">
        <ion-card-header>
          <ion-card-title> 2016 </ion-card-title>
          <ion-card-subtitle>
            Inicio como desarrollador de sitios web.</ion-card-subtitle
          >
        </ion-card-header>

        <ion-card-content>
          <ul>
            <li>Habilidades adquiridas: Html, Css y Javascript</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </div>

    <div class="container right">
      <ion-card class="blur-element">
        <ion-card-header>
          <ion-card-title> 2018 </ion-card-title>
          <ion-card-subtitle>
            Inicio como desarrollador BackEnd.</ion-card-subtitle
          >
        </ion-card-header>

        <ion-card-content>
          <ul>
            <li>Habilidades adquiridas: Php y Laravel</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </div>

    <div class="container left">
      <ion-card class="blur-element">
        <ion-card-header>
          <ion-card-title> 2020 </ion-card-title>
          <ion-card-subtitle>
            Mejorando mi habilidades como desarrollador
            FrontEnd.</ion-card-subtitle
          >
        </ion-card-header>
        <ion-card-content>
          <ul>
            <li>Iniciativa como freelance</li>
            <li>Habilidades adquiridas: Vue, Angular, Ionic y Firebase</li>
            <li>Participación en Init</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </div>

    <div class="container right">
      <ion-card class="blur-element">
        <ion-card-header>
          <ion-card-title> 2022 </ion-card-title>
          <ion-card-subtitle>
            Momento de compartir mis conocimientos.</ion-card-subtitle
          >
        </ion-card-header>
        <ion-card-content>
          <ul>
            <li>Creador de contenido</li>
            <li>Nuevas habilidades: GraphQL, Electron</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/vue";
import { ref } from "vue";

const emits = defineEmits(["scrollPosition"]);
const edad = new Date().getFullYear() - new Date("1998-06-18").getFullYear();
const mainDiv = ref();
</script>

<style>
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
  background-color: var(--ion-color-primary);
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
  border: 4px solid var(--ion-color-primary);
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
  .title-timeline {
    color: white !important;
  }
}
</style>

<style scoped>
.blur-effect {
  backdrop-filter: blur(10px);
}
</style>
