<template>
  <div
    ref="mainDiv"
    style="overflow: auto; height: 80vh"
    @scroll="setScrollPosition()"
  >
    <ion-row>
      <ion-col>
        <ion-header
          v-if="scrollPosition == 0 && !isPlatform('desktop')"
          class="fade-in-title ion-no-border"
        >
          <ion-toolbar style="--background: transparent">
            <ion-title size="large">{{ props.pageTitle }}</ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-col>
    </ion-row>

    <ion-row class="center">
      <ion-col class="ion-padding" size-xs="12" size-lg="8">
        <p>
          Como desarrollador de software y usuario activo de Internet entiendo
          lo importante que es la privacidad, por esta razón todo el software
          desarrollado bajo la marca
          <span class="important-text">Dowar </span> recopila la mínima cantidad
          de datos permitiendo a los usuarios el mayor anonimato posible.
        </p>

        <h2>Datos recopilados</h2>
        <ul>
          <li>
            <span class="important-text">Nombre:</span> Será usado única y
            exclusivamente en el estricto caso de que se requiera contactarte
            por medio del correo electrónico ingresado al momento de tu
            registro.
          </li>
          <li>
            <span class="important-text">Usuario:</span> Será empleado única y
            exclusivamente para identificarte dentro de la aplicación.
          </li>
          <li>
            <span class="important-text">Correo electrónico:</span>
            El correo electrónico que ingresaste al momento de tu registro
            dentro de la aplicación será empleado para enviarte
            notificaciones(podrás cambiarlo en tu panel de configuración) o en
            el estricto caso de que se requiera contactarte.
          </li>
        </ul>

        <h2>Datos que se almacenan en tu dispositivo</h2>
        <ul>
          <li>
            <span class="important-text">Token de sesión:</span>
            Cuando sé realiza un inicio de sesión dentro de la aplicación
            automáticamente, se crea un token que sirve para identificarte con
            el servidor, este es almacenado en forma de cookie o en la caché de
            la aplicación, esto es debido a que algunas de las formas en las que
            distribuimos la aplicación no son compatibles con el formato de
            cookie.
          </li>
          <li>
            <span class="important-text">Modo offline:</span> La aplicación
            cuenta con una función que te permitirá acceder a los datos sin
            necesidad de tener una conexión activa a internet.
          </li>
          <li>
            <span class="important-text">Tema:</span> Se almacena en la caché
            las preferencias sobre el tema a utilizar dentro de la aplicación.
          </li>
          <li>
            <span class="important-text">Nuevo usuario:</span>
            Cuando se accede por primera vez a la aplicación automáticamente se
            genera una cookie cuyo único fin es el identificar a nuevos
            usuarios, esta cookie es independiente al usuario y se produce por
            cada dispositivo nuevo con el que se acceda por lo cual no es
            almacenada dentro de nuestro servidor.
          </li>
        </ul>

        <h2>Razones de contacto</h2>
        <p>
          Solamente se te contactará cuando sea estrictamente necesario, a
          continuación se detallan algunos escenarios de ejemplo.
        </p>
        <ul>
          <li>
            <span class="important-text">Problema con la aplicación:</span>
            Si por alguna razón la aplicación llegara a fallar te notificaremos
            vía correo electrónico.
          </li>
          <li>
            <span class="important-text">Novedades:</span> Cuando agreguemos o
            quitamos alguna función de la aplicación te lo notificaremos vía
            correo electrónico y dentro de la aplicación(esta opción puede ser
            desactivada desde tu panel de configuración).
          </li>
          <li>
            <span class="important-text">Cambios en las políticas:</span>
            Es importante que el usuario este al tanto de los cambios producidos
            en estos documentos, es por eso que vía correo electrónico y dentro
            de la aplicación se le notificara que existe una nueva versión.
          </li>
          <li>
            <span class="important-text">Newsletter:</span> Cuando activas esta
            función recibirás vía correo electrotónico(según tu configuración)
            información sobre nuestras nuevas publicaciones.
          </li>
        </ul>

        <h2>Seguridad de la aplicación</h2>
        <ul>
          <li>
            Las conexiones efectuadas por la aplicación son cifradas usando un
            certificado SSL.
          </li>
          <li>
            Las contraseñas se encuentran debidamente cifradas dentro la base de
            datos.
          </li>
        </ul>

        <p>
          Se está trabajando de manera activa para garantizar la seguridad y
          privacidad dentro de la aplicación, si eres desarrollador puedes ver
          el código fuente de la aplicación, los enlaces a esta se encuentran
          dentro de la aplicación.
          <br />
          De ser requerido se podrá eliminar toda la información relacionada con
          tu cuenta desde tu panel de configuracion.
          <br />
          Por último, quiero destacar que no se hace ningún tipo de seguimiento
          de actividad dentro de la aplicación y que los datos ingresados en
          ella no son compartidos con ningún tercero.
        </p>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonCol, IonHeader, IonRow, IonTitle, IonToolbar, isPlatform } from "@ionic/vue";
import { ref, watch } from "vue";

// vars
const props = defineProps({
  pageTitle: { type: String, required: true, default: "Politicas" },
  mainSegment: { type: String, default: "privacy" },
});
const emits = defineEmits(["showTitle"]);
const scrollPosition = ref(0);
const mainDiv = ref();

watch(
  () => scrollPosition.value,
  (newValue) => {
    if (newValue == 0) emits("showTitle", false);
    else emits("showTitle", true);
  },
);

function setScrollPosition(): void {
  scrollPosition.value = mainDiv.value.scrollTop;
}
</script>

<style scoped>
.important-text {
  font-weight: bold;
}

.div-main-content {
  max-height: 82vh;
  overflow: auto;
}

@media only screen and (min-width: 768px) {
  .main-section {
    float: right;
  }
}
</style>
