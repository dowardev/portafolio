<template>
  <ion-content>
    <ion-row class="ion-padding">
      <ion-col size="12">
        <div id="div-contenido-historia">
          Soy desarrollador especializado en la creación de aplicaciones
          multiplataforma usando tecnologías web, tengo {{ edad }} años de edad
          y a continuación te contaré un poco más sobre mi historia.
          <br />
          Inicie con en el desarrollado de sitios Web en el año 2016 donde
          empecé con las tres tecnologías básicas HTML, CSS y JavaScript, por
          motivos de seguir con mis estudios deje un poco de lado esto y no fue
          hasta el 2018 donde lo retome, pero esta vez introduciéndome al
          BackEnd con Laravel, con el paso del tiempo fui aprendiendo otras
          tecnologías FrontEnd como Materialize y Bootstrap.
          <br />
          En el 2020 decidí emprender como freelance en la plataforma de
          Workana, con el pasar del tiempo fui adquiriendo otras habilidades
          como Vue, React y Angular.
          <br />
          A mediados del 2020 comencé a trabajar con Ionic lo cual me permitiría
          desarrollar aplicaciones multiplataforma(PWA, Android, iOS), al mismo
          tiempo me permitía pulir mis conocimientos con los Frameworks Vue y
          Angular.
          <br />
          Otros conocimientos que he adquirido a lo largo del tiempo son el
          manejo de sistemas operativos Linux, Git, Python, Java y C#.
          <br />
          Para este 2021 comenzaré a compartir mis conocimientos subiendo
          contenido a la plataforma de YouTube y Udemy y con esto poder ayudar a
          todo aquel que lo necesite con lo poco que he aprendido durante todos
          estos años. Todos está en nuestras mentes, tanto si crees que puedes
          como que no puedes estas en lo correcto. Henry Ford
        </div>
      </ion-col>
    </ion-row>

    <div class="timeline">
      <div class="container left">
        <div class="content-timeline">
          <h2>2016</h2>
          <p>
            Inicio como desarrollador de sitios web.
          </p>
        </div>
      </div>
      <div class="container right">
        <div class="content-timeline">
          <h2>2018</h2>
          <p>
            Nueva habilidad: Laravel
          </p>
        </div>
      </div>
      <div class="container left">
        <div class="content-timeline">
          <h2>2020</h2>
          <p>
            Iniciativa como freelance
            <br />
            Nuevas habilidades: Vue, React, Angular y Ionic
            <br />
            Participacion en Init
          </p>
        </div>
      </div>
      <div class="container right">
        <div class="content-timeline">
          <h2>2021</h2>
          <p>
            Creador de contenido
          </p>
        </div>
      </div>
      <!--  <div class="container left">
        <div class="content-timeline">
          <h2>2011</h2>
          <p>
            Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec
            admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis
            iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto
            primis ea eam.
          </p>
        </div>
      </div>
      <div class="container right">
        <div class="content-timeline">
          <h2>2007</h2>
          <p>
            Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec
            admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis
            iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto
            primis ea eam.
          </p>
        </div>
      </div> -->
    </div>
  </ion-content>
</template>

<script>
import { IonContent } from "@ionic/vue";
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  components: {
    IonContent,
  },
  data() {
    return {
      edad: 0,
    };
  },
  mounted() {
    const cumpleaños = moment("1998-06-18");

    const hoy = moment();
    const edad = hoy.diff(cumpleaños, "years");
    this.edad = edad;
  },
});
</script>

<style scope>
* {
  box-sizing: border-box;
}
#div-contenido-historia {
  font-size: 19px;
  text-align: initial;
}
@media (min-width: 1025px) and (max-width: 1280px) {
  #div-contenido-historia {
    font-size: 22px;
  }
}
@media (min-width: 1281px) {
  #div-contenido-historia {
    font-size: 22px;
  }
}
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
  background-color: white;
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
  border: 4px solid #4a91fc;
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
  background-color: #0a151f;
  position: relative;
  border-radius: 6px;
}

/* Media queries - Responsive timeline on screens less than 600px wide */
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
}
</style>
