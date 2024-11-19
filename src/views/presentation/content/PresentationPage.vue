<template>
  <div>
    <ion-row>
      <ion-col>
        <ion-header
          v-if="showTitle && !isPlatform('desktop')"
          class="fade-in-title ion-no-border"
        >
          <ion-toolbar style="--background: transparent">
            <ion-title size="large">{{ props.pageTitle }}</ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="12" size-lg="6">
        <InformationComponent />
      </ion-col>

      <ion-col size="12" size-lg="6">
        <div v-if="props.mainSegment == 'skills'" class="components-section">
          <SkillsPage
            @scroll-position="
              $event == 0
                ? emits('showTitle', false)
                : emits('showTitle', true);
              $event == 0 ? (showTitle = true) : (showTitle = false);
            "
          />
        </div>

        <div v-if="props.mainSegment == 'history'" class="components-section">
          <HistoryPage
            @scroll-position="
              $event == 0
                ? emits('showTitle', false)
                : emits('showTitle', true);
              $event == 0 ? (showTitle = true) : (showTitle = false);
            "
          />
        </div>

        <div v-if="props.mainSegment == 'portfolio'" class="components-section">
          <PortfolioPage
            @scroll-position="
              $event == 0
                ? emits('showTitle', false)
                : emits('showTitle', true);
              $event == 0 ? (showTitle = true) : (showTitle = false);
            "
          />
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  useBackButton,
  alertController,
  isPlatform,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { App } from "@capacitor/app";

// components
import InformationComponent from "../information/InformationComponent.vue";
import SkillsPage from "../../skills/SkillsPage.vue";
import HistoryPage from "../../history/HistoryPage.vue";
import PortfolioPage from "../../portfolio/PortfolioPage.vue";

const props = defineProps({
  mainSegment: {
    type: String,
    default: "skills",
    required: true,
    validator: (value: any) => {
      return ["skills", "history", "portfolio"].includes(value);
    },
  },
  pageTitle: { type: String, required: true, default: "Inicio" },
});

const emits = defineEmits(["showTitle"]);

onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
  });
});

// functions
async function alertExitApp(): Promise<void> {
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
}
const showTitle = ref(true);
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}

.div-main-content {
  height: calc(100vh - 142px);
}

ion-content {
  --overflow: hidden;
}

.components-section {
  height: calc(100vh - 439px);
  overflow: auto;
}

/*tablet */
@media only screen and (min-width: 768px) {
  .texto-bienvenida {
    margin-top: 16px;
  }
  .components-section {
    height: calc(100vh - 146px);
    overflow: auto;
  }
  .slogan {
    text-align: center;
    font-family: OpenSans-Bold !important;
    opacity: 0.6;
  }
}

@media only screen and (min-width: 768px) {
  .main-section {
    float: right;
  }
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
