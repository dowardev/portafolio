<template>
  <ion-card class="ion-padding blur-effect">
    <!-- perfil -->
    <ion-row>
      <ion-col class="center" size="12">
        <img
          src="@/assets/portafolio/foto_perfil.jpg"
          alt=""
          class="img-perfil"
        />
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col class="center" size-lg="12">
        <h1>Gonzalo Ponce</h1>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col class="center" size="12">
        <img
          src="@/assets/portafolio/dowar.png"
          style="max-width: 330px; margin-left: 14px"
        />
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col class="center" size="12">
        <p style="text-align: center">
          Desarrollador de experiencias multiplataforma
        </p>
      </ion-col>
    </ion-row>

    <!-- redes -->
    <ion-row>
      <ion-col>
        <div style="display: flex; justify-content: space-around">
          <!-- email -->
          <ion-button
            id="click-trigger-bussiness-email"
            button
            class="social-button"
            @mouseover="fillEmailContact = '#C87C5B'"
            @mouseleave="fillEmailContact = defaultColorFill"
          >
            <ion-icon
              :style="{ color: fillEmailContact }"
              :icon="mail"
            ></ion-icon>
          </ion-button>

          <!-- LinkedIn -->
          <ion-button
            id="click-trigger-bussiness-linkedin"
            button
            class="social-button"
            @mouseover="fillLinkedIn = '#7373FF'"
            @mouseleave="fillLinkedIn = defaultColorFill"
          >
            <ion-icon
              :style="{ color: fillLinkedIn }"
              :icon="logoLinkedin"
            ></ion-icon>
          </ion-button>

          <!-- contact form -->
          <ion-button
            id="open-modal-cocntacto-form"
            button
            class="social-button"
            @mouseover="fillContactForm = '#5FFEF7'"
            @mouseleave="fillContactForm = defaultColorFill"
          >
            <ion-icon
              :icon="chatbubble"
              :style="{ color: fillContactForm }"
            ></ion-icon>
          </ion-button>

          <!-- cv -->
          <ion-button
            id="click-trigger-cv"
            button
            class="social-button"
            @mouseover="fillCVForm = '#FFC65B'"
            @mouseleave="fillCVForm = defaultColorFill"
          >
            <ion-icon
              :icon="documentText"
              :style="{ color: fillCVForm }"
            ></ion-icon>
          </ion-button>
        </div>
      </ion-col>
    </ion-row>
  </ion-card>

  <!-- popovers -->
  <!-- popover email -->
  <ion-popover
    trigger="click-trigger-bussiness-email"
    trigger-action="click"
    :dismiss-on-select="true"
  >
    <ion-content>
      <!-- <ion-list-header> -->
      <!--   <ion-label> Profesional</ion-label> -->
      <!-- </ion-list-header> -->
      <ion-item
        button
        lines="none"
        class="transparent"
        @click="copyToClipboard({ text: 'gonzalo@dowar.xyz' })"
      >
        <ion-icon slot="start" :icon="copyOutline" color="primary"></ion-icon>

        <ion-label class="ion-text-wrap">Copiar correo electrónico</ion-label>
      </ion-item>

      <ion-item
        lines="none"
        class="transparent"
        button
        @click="
          openMail({
            mail: 'gonzalo@dowar.xyz',
            subject: 'Contacto%20laboral',
          })
        "
      >
        <ion-icon slot="start" :icon="openOutline" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">Abrir cliente de correo</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>

  <!-- popover linkedin -->
  <ion-popover
    trigger="click-trigger-bussiness-linkedin"
    trigger-action="click"
    :dismiss-on-select="true"
  >
    <ion-content>
      <ion-item
        button
        lines="none"
        @click="copyToClipboard({ text: 'dowar' })"
        class="transparent"
      >
        <ion-icon slot="start" :icon="copyOutline" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">Copiar usuario</ion-label>
      </ion-item>

      <ion-item
        button
        lines="none"
        class="transparent"
        @click="
          copyToClipboard({
            text: 'https://www.linkedin.com/in/dowar/',
          })
        "
      >
        <ion-icon slot="start" :icon="copyOutline" color="primary"></ion-icon>

        <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
      </ion-item>

      <ion-item
        button
        class="transparent"
        href="https://www.linkedin.com/in/dowar/"
        target="_blank"
        lines="none"
      >
        <ion-icon slot="start" :icon="openOutline" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>

  <!-- popover cv -->
  <ion-popover
    trigger="click-trigger-cv"
    trigger-action="click"
    :dismiss-on-select="true"
  >
    <ion-content>
      <ion-item
        button
        class="transparent"
        href="https://cvdesignr.com/p/66184fd822a3f?hl=es_ES"
        target="_blank"
        lines="none"
      >
        <ion-icon slot="start" :icon="openOutline" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">Español</ion-label>
      </ion-item>

      <ion-item
        button
        class="transparent"
        href="https://cvdesignr.com/p/661850b19f8af?hl=es_ES"
        target="_blank"
        lines="none"
      >
        <ion-icon slot="start" :icon="openOutline" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">English</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>

  <!-- modals -->
  <ion-modal ref="modal" trigger="open-modal-cocntacto-form">
    <ContactModal />
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  useBackButton,
  alertController,
  IonModal,
  IonItem,
  IonLabel,
  IonPopover,
  IonContent,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  mail,
  logoMastodon,
  logoLinkedin,
  copyOutline,
  openOutline,
  chatbubble,
  documentText,
} from "ionicons/icons";
import { App } from "@capacitor/app";
import ContactModal from "../../contact/ContactPage.vue";

const defaultColorFill = "#777777";
const fillEmailContact = ref(defaultColorFill);
const fillLinkedIn = ref(defaultColorFill);
const fillContactForm = ref(defaultColorFill);
const fillCVForm = ref(defaultColorFill);

// mounted()
onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
  });
});

// functions
async function alertExitApp() {
  const alert = await alertController.create({
    header: "Alerta",
    message: "Esta a punto de salir de la aplicación",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        id: "cancel-button",
        handler: () => {
          // console.log('Confirm Cancel:', blah)
        },
      },
      {
        text: "Continuar",
        id: "confirm-button",
        handler: () => {
          App.exitApp();
        },
      },
    ],
  });
  await alert.present();

  const { role } = await alert.onDidDismiss();
  console.log("onDidDismiss resolved with role", role);
}

async function copyToClipboard(params: { text: any }) {
  const text = params.text;
  try {
    await navigator.clipboard.writeText(text);
  } catch ($e) {
    alert("Cannot copy");
  }
}

function openMail(params: { mail: string; subject: string }) {
  const mail = params.mail;
  const subject = params.subject;
  location.href = `mailto:${mail}?Subject=${subject}`;
}
</script>

<style scoped>
.img-perfil {
  border-radius: 50%;
  width: 27vh;
  height: 27vh;
}

.social-button {
  --box-shadow: none;
  --background: transparent;
}

.blur-effect {
  backdrop-filter: blur(10px);
}
</style>
