<template>
  <div>
    <ion-row>
      <ion-col style="display: flex" class="ion-justify-content-center">
        <h2>Trabajemos juntos</h2>
      </ion-col>
    </ion-row>

    <ion-grid>
      <ion-row>
        <ion-col
          class="ion-justify-content-center ion-align-items-center"
          style="display: flex"
        >
          <div
            v-for="platform in freelancePlatforms"
            :key="platform.name"
            style="cursor: pointer"
            class="ion-padding-start ion-padding-end"
          >
            <img
              style="width: 40px"
              :src="platform.image"
              :alt="platform.name"
              @click="openUrl(platform.url)"
            />
          </div>

          <ion-button
            v-if="showContactForm?.freelance"
            size="large"
            fill="clear"
            @click="openContactModal()"
          >
            <ion-icon :icon="mail"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-row>
      <ion-col size="12">
        <Swiper
          :modules="[Pagination, Navigation, Autoplay]"
          :slides-per-view="1"
          :space-between="0"
          :loop="true"
          :centered-slides="true"
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          class="swiper-container"
        >
          <SwiperSlide
            v-for="(comment, index) in freelanceComments"
            :key="index"
          >
            <ion-card class="shadow-1">
              <ion-item lines="full">
                <ion-thumbnail slot="start">
                  <ion-icon
                    :icon="chatbubblesOutline"
                    style="font-size: 24px"
                  />
                </ion-thumbnail>

                <ion-label>
                  <h2>{{ comment.title }}</h2>

                  <div>
                    <ion-icon
                      v-for="n in comment.rating"
                      :key="n"
                      :icon="starIcon"
                      style="color: gold; font-size: 16px"
                    ></ion-icon>
                  </div>
                </ion-label>
              </ion-item>

              <div class="ion-padding-start">
                <div
                  v-if="comment.text"
                  style="max-height: 200px; overflow: auto"
                >
                  <p>{{ comment.text }}</p>
                </div>
              </div>
            </ion-card>
          </SwiperSlide>
        </Swiper>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonThumbnail,
} from "@ionic/vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { type FreelancePlatform, type FreelanceComment } from "@/services/types";
import { type ScreenSize } from "@/utils/types/homeTemplate";
import { mail, star as starIcon, chatbubblesOutline } from "ionicons/icons";

interface Props {
  freelancePlatforms?: FreelancePlatform[];
  freelanceComments?: FreelanceComment[];
  showContactForm?: {
    socials?: boolean;
    freelance?: boolean;
  };
  screenSize?: ScreenSize;
}

const props = defineProps<Props>();

function openUrl(url: string) {
  window.open(url, "_blank");
}

function getPlatformImage(platformName: string): string | undefined {
  return props.freelancePlatforms?.find(p => p.name === platformName)?.image;
}

async function openContactModal() {
  const { modalController } = await import("@ionic/vue");
  const { default: ContactModal } = await import(
    "@/components/modals/contact/ContactModal.vue"
  );
  const modal = await modalController.create({
    component: ContactModal,
  });
  modal.present();
}
</script>

<style scoped>
.swiper-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>