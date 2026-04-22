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
            <ion-chip
              v-for="(tag, index) in homeData.tags"
              :key="index"
              color="primary"
              >{{ tag }}</ion-chip
            >
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

      <ion-row
        v-if="homeData.socials && homeData.socials.length > 0"
        class="center"
      >
        <ion-col :class="{ center: screenSize.preset == 'xs' }">
          <div class="social-buttons">
            <ion-button
              v-for="social in homeData.socials"
              :key="social.platform"
              :href="social.url"
              target="_blank"
              fill="clear"
            >
              <ion-icon
                slot="icon-only"
                :icon="getSocialIcon(social.iconName || social.platform)"
              ></ion-icon>
            </ion-button>

            <!-- form contact -->
            <ion-button
              v-if="homeData.showContactForm?.socials"
              fill="clear"
              @click="openContactModal()"
            >
              <ion-icon slot="icon-only" :icon="mail"></ion-icon>
            </ion-button>
          </div>
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
            <img :src="homeData.photoUrl" alt="" class="img-perfil" />
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
  logoGitlab,
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
  mailOutline,
} from "ionicons/icons";
import { App } from "@capacitor/app";

// components
import ContactModal from "../../../components/modals/contact/ContactModal.vue";

// controllers
import SystemController from "@/controllers/systemController";
import HomeEditorController from "@/controllers/homeEditorController";
const systemController = new SystemController();
const homeEditorController = new HomeEditorController();
// end controllser

// services
import type { HomePageData } from "@/services/types";

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

const socialIconsMap: Record<string, any> = {
  logoFacebook,
  logoX,
  logoTwitter,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
  logoGitlab,
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
  chatbox,
};

function getSocialIcon(iconName: string): any {
  if (!iconName) return logoLinkedin;

  // direct match
  if (socialIconsMap[iconName]) return socialIconsMap[iconName];

  const lower = iconName.toLowerCase();
  if (socialIconsMap[lower]) return socialIconsMap[lower];

  // try adding/removing 'logo' prefix in different casings
  const withLogo = iconName.startsWith("logo")
    ? iconName
    : `logo${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}`;
  if (socialIconsMap[withLogo]) return socialIconsMap[withLogo];
  if (socialIconsMap[withLogo.toLowerCase()])
    return socialIconsMap[withLogo.toLowerCase()];

  // try compacted name (remove spaces)
  const compact = iconName.replace(/\s+/g, "").toLowerCase();
  if (socialIconsMap[compact]) return socialIconsMap[compact];

  return logoLinkedin;
}

// homepage data
const homeData = ref<HomePageData>({
  name: "Gonzalo Ponce",
  tags: ["Full-Stack Developer", "Blogger"],
  description:
    "Desarrollador Full-Stack con mas de 5 años de experiencia en el desarrollo de aplicaciones multiplataforma.",
  socials: [],
  logoUrl: null,
  photoUrl: null,
  stack: [],
  skillCategories: [],
  experience: [],
  projects: [],
  certificates: [],
  freelance: [],
  freelancePlatforms: [],
  freelanceComments: [],
  showContactForm: {
    socials: false,
    freelance: false,
  },
});
// end vars

// mounted()
onMounted(async () => {
  useBackButton(10, () => {
    alertExitApp();
  });

  // cargar datos de homepage
  try {
    const data = await homeEditorController.loadPublicData();
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
        stack: data.stack || [],
        skillCategories: data.skillCategories || [],
        experience: data.experience || [],
        projects: data.projects || [],
        certificates: data.certificates || [],
        freelance: data.freelance || [],
        freelancePlatforms: this.convertToPlatforms(data.freelance || []),
        freelanceComments: this.convertToComments(data.freelance || []),
        showContactForm: data.showContactForm || {
        socials: false,
        freelance: false,
      },
      };
      console.log("HomeData socials after load:", homeData.value.socials);
      if (homeData.value.socials && homeData.value.socials.length > 0) {
        homeData.value.socials.forEach((s: any, i: number) => {
          const icon = getSocialIcon(s.iconName);
          console.log(
            `Social[${i}]: platform="${s.platform}", iconName="${s.iconName}", icon=`,
            icon,
          );
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

function convertToPlatforms(freelance: any[]) {
  return freelance.map(item => ({
    name: item.name,
    image: item.image,
    url: item.url,
  }));
}

function convertToComments(freelance: any[]) {
  const comments: any[] = [];
  for (const item of freelance) {
    if (item.comment) {
      comments.push({
        platformName: item.name,
        title: item.comment.title,
        text: item.comment.text,
        rating: item.comment.rating,
      });
    }
  }
  return comments;
}
</script>

<style scoped>
.social-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Force social icons to be monochromatic and use a single color.
   Use --social-icon-color to override (defaults to a neutral grey). */
.social-buttons ion-button ion-icon {
  color: var(--social-icon-color, #777777);
  /* ensure SVGs respect the color value */
  fill: currentColor !important;
  stroke: none !important;
  transition:
    color 0.15s ease,
    transform 0.08s ease;
}
.social-buttons ion-button:hover ion-icon {
  color: var(--social-icon-color-hover, #ff5b29);
  transform: translateY(-2px);
}

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
