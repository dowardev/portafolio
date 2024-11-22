<template>
  <div class="gradient-border">
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
          <img src="@/assets/portafolio/dowar.png" class="img-logo" />
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

            <!-- upwork -->
            <ion-button
              id="click-trigger-upwork"
              button
              class="social-button"
              @mouseover="fillUpwork = '#6bd341'"
              @mouseleave="fillUpwork = defaultColorFill"
            >
              <img
                v-if="fillUpwork == defaultColorFill"
                src="../../../assets/otros/icons8-upwork-50.png"
                alt="upwork-logo"
                srcset=""
                style="width: 22px"
              />

              <img
                v-if="fillUpwork == '#6bd341'"
                src="../../../assets/otros/icons8-upwork2-50.png"
                alt="upwork-logo"
                srcset=""
                style="width: 22px"
              />
            </ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-card>
  </div>

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

  <!-- popover upwork -->
  <ion-popover
    trigger="click-trigger-upwork"
    trigger-action="click"
    :dismiss-on-select="true"
  >
    <ion-content>
      <ion-item
        button
        lines="none"
        class="transparent"
        @click="
          copyToClipboard({
            text: 'https://www.upwork.com/freelancers/~0162303a78d7d448db',
          })
        "
      >
        <ion-icon slot="start" :icon="copyOutline" color="primary"></ion-icon>

        <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
      </ion-item>

      <ion-item
        button
        class="transparent"
        href="https://www.upwork.com/freelancers/~0162303a78d7d448db"
        target="_blank"
        lines="none"
      >
        <ion-icon slot="start" :icon="openOutline" color="primary"></ion-icon>
        <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
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
import ContactModal from "./ContactModal.vue";

const defaultColorFill = "#777777";
const fillEmailContact = ref(defaultColorFill);
const fillLinkedIn = ref(defaultColorFill);
const fillContactForm = ref(defaultColorFill);
const fillCVForm = ref(defaultColorFill);
const fillUpwork = ref(defaultColorFill);

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

.img-logo {
  max-width: 100%;
  max-height: 100%;
  width: calc(100% - 70px);
  height: 10dvh;
}

.social-button {
  --box-shadow: none;
  --background: transparent;
}

.blur-effect {
  backdrop-filter: blur(10px);
}

.gradient-border {
  --border-width: 4px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: var(--border-width);
  border-radius: 4px;
}

.gradient-border::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    60deg,
    #f0f9fe,
    #d1edfb,
    #a7ddf7,
    #7ccbf3,
    #51b9ef,
    #3dade9
  );
  background-size: 300% 300%;
  background-position: 0 50%;
  border-radius: inherit;
  animation: moveGradient 1s alternate infinite;
}

@keyframes moveGradient {
  50% {
    background-position: 100% 50%;
  }
}

ion-card {
  width: 100%;
  margin: 0;
}
</style>
