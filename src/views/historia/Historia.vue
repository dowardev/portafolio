<template>
  <ion-page>
    <ion-content>
      <ion-row class="ion-padding">
        <ion-col size="12">
          <div
            id="div-historia"
            style="padding-left: 8rem;padding-right: 8rem;font-size: 18px;line-height: 1.6;"
          >
            Soy originario de Hidalgo del Parral Chihuahua Mexico y tengo
            {{ edad }} años de edad.
            <br />
            Me especializo en el desarrollado de sitios web desde el año 2016
            donde empece con las tres tecnologias basicas Html, Css y
            Javascript, por motivos de seguir con mis estudios deje un poco de
            lado esto y no fue hasta el 2018 donde lo retome pero esta vez con
            Laravel, con el paso del tiempo fui aprendiendo otras tecnologias
            FrontEnd como Jquery, Materialize y Bootstrap.
            <br />
            En el 2020 decidi emprender como freelance en la plataforma de
            Workana en la que adquiri un proyecto,al mismo tiempo en el que
            desarrollaba este proyecto tome un curso en la plataforma de Udemy
            en la cual aprendi 3 nuevas tecnologias Vue, React y Angular,
            poniendo en practica solamente a Vue(ya que fue la que mas me gusto)
            en el desarrollo de mi sitio web personal. Meses despues adquiri
            otro curso de Udemy para el desarrollo de aplicaciones moviles
            usando Ionic y fue ahi donde puse en practica mis conocimientos con
            el framework de Angular. A lo largo de este año 2020 adquiri otros
            conocimientos como el manejo de la libreria grafica Vuetify, manejo
            de servidores(basico), otros conocimientos que he adquirido a lo
            largo del tiempo son el manejo de sistemas operativos linux, git,
            python, Java y C#.
            <br />
            Me gusta compartir mis conocimientos con los demas y siempre estoy
            dispuesto ayudar a todo aquel que lo necesite para hacer un poco mas
            facil su trayectoria como desarrollador.
          </div>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
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
