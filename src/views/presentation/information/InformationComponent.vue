<template>
  <ion-row class="ion-padding center">
    <ion-col size="12" class="center">
      <img
        src="@/assets/portafolio/foto_perfil.jpg"
        alt=""
        class="img-perfil"
      />
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="12">
      <div class="center">
        <div class="letters">
          <span class="letter">G</span>
          <span class="letter">o</span>
          <span class="letter">n</span>
          <span class="letter">z</span>
          <span class="letter">a</span>
          <span class="letter">l</span>
          <span class="letter">o</span>
          <span class="letter"></span>
          <span class="letter">P</span>
          <span class="letter">o</span>
          <span class="letter">n</span>
          <span class="letter">c</span>
          <span class="letter">e</span>
          <span class="letter"></span>
        </div>
      </div>

      <ion-row>
        <ion-col class="center">
          <!-- mail -->
          <ion-button
            id="click-trigger-bussiness-email"
            fill="clear"
            @mouseover="fillEmailContact = '#d94f4f'"
            @mouseleave="fillEmailContact = '#777777'"
          >
            <ion-icon
              slot="start"
              :style="{ color: fillEmailContact }"
              :icon="mail"
            ></ion-icon>
          </ion-button>

          <ion-popover
            trigger="click-trigger-bussiness-email"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <!-- professional mail -->
              <ion-list>
                <ion-list-header>
                  <ion-label> Profesional</ion-label>
                </ion-list-header>
                <ion-item
                  button
                  lines="none"
                  @click="copyToClipboard({ text: 'contacto@dowar.xyz' })"
                >
                  <ion-icon
                    slot="start"
                    :icon="copyOutline"
                    color="primary"
                  ></ion-icon>

                  <ion-label class="ion-text-wrap"
                    >Copiar correo electronico</ion-label
                  >
                </ion-item>

                <ion-item
                  lines="none"
                  button
                  @click="
                    openMail({
                      mail: 'contacto@dowar.xyz',
                      subject: 'Contacto%20laboral',
                    })
                  "
                >
                  <ion-icon
                    slot="start"
                    :icon="openOutline"
                    color="primary"
                  ></ion-icon>
                  <ion-label class="ion-text-wrap"
                    >Abrir cliente de correo</ion-label
                  >
                </ion-item>
              </ion-list>

              <!-- help mail -->
              <ion-list>
                <ion-list-header>
                  <ion-label> Ayuda</ion-label>
                </ion-list-header>
                <ion-item
                  button
                  lines="none"
                  @click="copyToClipboard({ text: 'ayuda@dowar.xyz' })"
                >
                  <ion-icon
                    slot="start"
                    :icon="copyOutline"
                    color="primary"
                  ></ion-icon>

                  <ion-label class="ion-text-wrap"
                    >Copiar correo electronico</ion-label
                  >
                </ion-item>

                <ion-item
                  lines="none"
                  button
                  @click="
                    openMail({ mail: 'ayuda@dowar.xyz', subject: 'Ayuda' })
                  "
                >
                  <ion-icon
                    slot="start"
                    :icon="openOutline"
                    color="primary"
                  ></ion-icon>
                  <ion-label class="ion-text-wrap"
                    >Abrir cliente de correo</ion-label
                  >
                </ion-item>
              </ion-list>
            </ion-content>
          </ion-popover>

          <!-- LinkedIn -->
          <ion-button
            id="click-trigger-bussiness-linkedin"
            lines="none"
            fill="clear"
            @mouseover="fillLinkedIn = '#0074b1'"
            @mouseleave="fillLinkedIn = '#777777'"
          >
            <ion-icon
              slot="start"
              :style="{ color: fillLinkedIn }"
              :icon="logoLinkedin"
            ></ion-icon>
          </ion-button>

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
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Copiar usuario</ion-label>
              </ion-item>

              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://www.linkedin.com/in/dowar/',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://www.linkedin.com/in/dowar/"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>

          <!-- contact form -->
          <ion-button
            id="open-modal-cocntacto-form"
            button
            fill="clear"
            lines="none"
            @mouseover="fillContactForm = '#4dba87'"
            @mouseleave="fillContactForm = defaultColorFill"
          >
            <ion-icon
              slot="start"
              :icon="chatbubble"
              :style="{ color: fillContactForm }"
            ></ion-icon>
          </ion-button>
          <ion-modal ref="modal" trigger="open-modal-cocntacto-form">
            <ContactModal />
          </ion-modal>

          <!-- mastodon -->
          <ion-button
            id="click-trigger-mastodon"
            lines="none"
            fill="clear"
            @mouseover="fillMastodon = '#2791da'"
            @mouseleave="fillMastodon = '#777777'"
          >
            <ion-icon
              slot="start"
              :style="{ color: fillMastodon }"
              :icon="logoMastodon"
            ></ion-icon>
          </ion-button>

          <ion-popover
            trigger="click-trigger-mastodon"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: '@dowar@mastodon.social',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Copiar usuario</ion-label>
              </ion-item>

              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://mastodon.social/web/@dowar',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://mastodon.social/web/@dowar"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>

          <!-- matrix -->
          <ion-button
            id="click-trigger-matrix"
            lines="none"
            fill="clear"
            @mouseleave="matrixImage = matrixGrayImage"
            @mouseover="matrixImage = matrixBlackImage"
          >
            <img :src="matrixImage" style="width: 26px" />
          </ion-button>

          <ion-popover
            trigger="click-trigger-matrix"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://matrix.to/#/#dowarCommunity:matrix.org',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://matrix.to/#/#dowarCommunity:matrix.org"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-col>
      </ion-row>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  useBackButton,
  alertController,
  IonModal,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  mail,
  logoMastodon,
  logoLinkedin,
  copyOutline,
  openOutline,
  chatbubble,
} from "ionicons/icons";
import { App } from "@capacitor/app";
import ContactModal from "../../contact/ContactPage.vue";
import matrixGrayImage from "../../../assets/otros/matrix-logo-gray.svg";
import matrixBlackImage from "../../../assets/otros/matrix-logo-black.svg";

const defaultColorFill = "#777777";
const fillEmailContact = ref("#777777");
const fillMastodon = ref("#777777");
const fillLinkedIn = ref("#777777");
const fillContactForm = defaultColorFill;
const matrixImage = matrixGrayImage;

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

<style scoped src="./animacion-nombre.css"></style>

<style scoped>
.img-perfil {
  border-radius: 50%;
  width: 17vh;
  height: 17vh;
}
.center {
  display: flex;
  justify-content: center;
}
/* smartphones vertical */
@media (min-width: 320px) and (max-width: 480px) {
  .texto-bienvenida {
    margin-top: 21px;
  }
  .img-logo {
    width: 215px;
  }
}
/* smartphones horizontal */
@media only screen and (min-width: 600px) {
  .img-logo {
    width: 186px;
  }
  .texto-bienvenida {
    margin-top: 16px;
  }
}
/*tablet */
@media only screen and (min-width: 768px) {
  .img-logo {
    width: 226px;
  }
  .texto-bienvenida {
    margin-top: 16px;
  }
  .img-perfil {
    border-radius: 50%;
    width: 182px;
    height: 182px;
  }
}
/* escritorio */
@media only screen and (min-width: 992px) {
  .img-proyecto {
    width: 241px;
  }

  #texto-bienvenida {
    display: flex;
    justify-content: center;
  }
  .img-logo {
    width: 215px;
    margin-right: 100%;
  }
  .img-perfil {
    border-radius: 50%;
    width: 182px;
    height: 182px;
  }
}
.slogan {
  text-align: center;
  font-family: OpenSans-Bold !important;
  opacity: 0.6;
}
@media (prefers-color-scheme: dark) {
  .slogan {
    opacity: 0.3;
  }
  p,
  ion-label,
  ion-text {
    font-family: OpenSans-Medium !important;
  }
  p {
    opacity: 0.7;
  }
}
</style>
