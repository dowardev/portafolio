<template>
  <ion-row>
    <ion-col class="info-sec" size-xs="12" size-md="6" size-xl="6">
      <ion-row>
        <ion-col :class="{ center: screenSize.preset == 'xs' }">
          <h1 v-if="homeData.name">{{ homeData.name }}</h1>
        </ion-col>
      </ion-row>

      <ion-row v-if="homeData.tags && homeData.tags.length > 0">
        <ion-col>
          <div :class="{ center: screenSize.preset == 'xs' }">
            <ion-chip v-for="(tag, index) in homeData.tags" :key="index" color="primary">{{ tag }}</ion-chip>
          </div>
        </ion-col>
      </ion-row>

      <ion-row v-if="homeData.description">
        <ion-col size-xs="12">
          <p
            :style="{
              textAlign: screenSize.preset == 'xs' ? 'center' : 'initial',
            }"
          >
            {{ homeData.description }}
          </p>
        </ion-col>
      </ion-row>

      <ion-row v-if="homeData.socials && homeData.socials.length > 0" class="center">
        <ion-col :class="{ center: screenSize.preset == 'xs' }">
          <ion-button
            v-for="(social, index) in homeData.socials"
            :key="index"
            :href="social.url"
            target="_blank"
            class="social-button"
          >
            <ion-icon
              slot="icon-only"
              :icon="getSocialIcon(social.platform)"
            ></ion-icon>
          </ion-button>

          <!-- form contact -->
          <ion-button
            class="social-button"
            @mouseover="fillContactForm = '#ff5b29'"
            @mouseleave="fillContactForm = defaultColorFill"
            @click="openContactModal()"
          >
            <ion-icon
              slot="icon-only"
              :style="{ color: fillContactForm }"
              :icon="chatbox"
            ></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-col>

    <ion-col
      class="img-sec ion-align-items-center ion-justify-content-center"
      :class="{ 'ion-justify-content-center': screenSize.preset == 'xs' }"
      size-xs="12"
      size-md="6"
      style="display: flex"
    >
      <div>
        <ion-row v-if="homeData.photoUrl">
          <ion-col style="display: flex" class="ion-justify-content-center">
            <img
              :src="homeData.photoUrl"
              alt=""
              class="img-perfil"
            />
          </ion-col>
        </ion-row>

        <ion-row v-if="homeData.logoUrl">
          <ion-col>
            <img :src="homeData.logoUrl" class="img-logo" />
          </ion-col>
        </ion-row>
      </div>
    </ion-col>
  </ion-row>

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
        class="transparent"
        @click="copyToClipboard({ text: 'dowar' })"
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

  <!-- popover bluesky -->
  <ion-popover
    trigger="click-trigger-bluesky"
    trigger-action="click"
    :dismiss-on-select="true"
  >
    <ion-content>
      <ion-item
        button
        lines="none"
        class="transparent"
        @click="copyToClipboard({ text: '@dowardev.bsky.social' })"
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
            text: 'https://bsky.app/profile/dowardev.bsky.social',
          })
        "
      >
        <ion-icon slot="start" :icon="copyOutline" color="primary"></ion-icon>

        <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
      </ion-item>

      <ion-item
        button
        class="transparent"
        href="https://bsky.app/profile/dowardev.bsky.social"
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
  IonChip,
  modalController,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  mail,
  copyOutline,
  openOutline,
  calendar,
  chatbox,
  logoFacebook,
  logoX,
  logoTwitter,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
  logoTiktok,
  logoGithub,
  logoDiscord,
  logoTwitch,
  logoPinterest,
  logoSnapchat,
  logoReddit,
  logoWhatsapp,
  logoWechat,
  logoSkype,
  logoSlack,
  logoDribbble,
  logoBehance,
  logoMedium,
  logoWordpress,
  logoVimeo,
  logoSoundcloud,
  logoApple,
  logoGoogle,
  logoAmazon,
  logoPaypal,
  logoBitcoin,
  logoStackoverflow,
  logoSteam,
  logoXbox,
  logoPlaystation,
  logoTumblr,
  logoVk,
} from "ionicons/icons";
import { App } from "@capacitor/app";

// components
import ContactModal from "../../../components/modals/contact/ContactModal.vue";

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end controllser

// services
import homeApi, { HomePageData } from "@/services/homeApi";

// images
import defaultPhoto from "@/assets/portafolio/foto_perfil.jpg";
import defaultLogo from "@/assets/portafolio/dowar.png";

// vars
const defaultColorFill = "#777777";
const fillEmailContact = ref(defaultColorFill);
const fillLinkedIn = ref(defaultColorFill);
const fillContactForm = ref(defaultColorFill);
const fillcalendly = ref(defaultColorFill);
const screenSize = ref(systemController.getScreenSize());

// Mapa de iconos por plataforma (objetos importados)
const socialIconsMap: Record<string, any> = {
  "facebook": logoFacebook,
  "x": logoX,
  "twitter": logoTwitter,
  "instagram": logoInstagram,
  "linkedin": logoLinkedin,
  "youtube": logoYoutube,
  "tiktok": logoTiktok,
  "github": logoGithub,
  "discord": logoDiscord,
  "twitch": logoTwitch,
  "pinterest": logoPinterest,
  "snapchat": logoSnapchat,
  "reddit": logoReddit,
  "whatsapp": logoWhatsapp,
  "wechat": logoWechat,
  "skype": logoSkype,
  "slack": logoSlack,
  "dribbble": logoDribbble,
  "behance": logoBehance,
  "medium": logoMedium,
  "wordpress": logoWordpress,
  "vimeo": logoVimeo,
  "soundcloud": logoSoundcloud,
  "apple": logoApple,
  "google": logoGoogle,
  "amazon": logoAmazon,
  "paypal": logoPaypal,
  "bitcoin": logoBitcoin,
  "stack overflow": logoStackoverflow,
  "steam": logoSteam,
  "xbox": logoXbox,
  "playstation": logoPlaystation,
  "tumblr": logoTumblr,
  "vk": logoVk,
};

function getSocialIcon(platform: string): any {
  return socialIconsMap[platform.toLowerCase()] || logoLinkedin;
}

// homepage data
const homeData = ref<HomePageData>({
  name: "Gonzalo Ponce",
  tags: ["Full-Stack Developer", "Blogger"],
  description: "Desarrollador Full-Stack con mas de 5 años de experiencia en el desarrollo de aplicaciones multiplataforma.",
  socials: [],
  logoUrl: null,
  photoUrl: null,
});
// end vars

// mounted()
onMounted(async () => {
  useBackButton(10, () => {
    alertExitApp();
  });

  // cargar datos de homepage
  try {
    const data = await homeApi.getPublic();
    console.log("Homepage data loaded:", data);
    console.log("Socials data:", data.socials);
    if (data) {
      homeData.value = {
        name: data.name || homeData.value.name,
        tags: data.tags?.length ? data.tags : homeData.value.tags,
        description: data.description || homeData.value.description,
        socials: data.socials || [],
        logoUrl: data.logoUrl,
        photoUrl: data.photoUrl,
      };
      console.log("HomeData socials after load:", homeData.value.socials);
      if (homeData.value.socials && homeData.value.socials.length > 0) {
        homeData.value.socials.forEach((s: any, i: number) => {
          const icon = getSocialIcon(s.platform);
          console.log(`Social[${i}]: platform="${s.platform}", icon=`, icon);
        });
      }
    }
  } catch (error) {
    console.error("Error loading homepage data:", error);
  }
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

async function copyToClipboard(params: { text: string }) {
  const text = params.text;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e: unknown) {
    alert("Cannot copy");
    console.error(e);
  }
}

function openMail(params: { mail: string; subject: string }) {
  const mail = params.mail;
  const subject = params.subject;
  location.href = `mailto:${mail}?Subject=${subject}`;
}

async function openContactModal() {
  const modal = await modalController.create({
    component: ContactModal,
  });

  modal.present();
}
</script>

<style scoped>
.img-perfil {
  border-radius: 50%;
  width: 18vh;
  height: 18vh;
}

.img-logo {
  max-width: 100%;
  max-height: 100%;
  width: 32dvh;
  height: 10dvh;
}

.social-button {
  --box-shadow: none;
  --background: transparent;
}

.blur-effect {
  backdrop-filter: blur(10px);
}

@media (max-width: 576px) {
  .info-sec {
    order: 2;
  }
  .img-sec {
    order: 1;
  }
}
.text-center {
  text-align: center;
}

@media (min-width: 768px) {
  .img-perfil {
    border-radius: 50%;
    width: 24vh;
    height: 24vh;
  }
}
</style>
