<template>
  <div class="final-section">
    <ion-row>
      <ion-col style="display: flex" class="ion-justify-content-center">
        <h2 class="heading-gradient">Trabajemos juntos</h2>
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
            class="platform-icon-container ion-padding-start ion-padding-end"
          >
            <img
              :src="platform.image"
              :alt="platform.name"
              class="platform-icon"
              @click="openUrl(platform.url)"
            />
          </div>

          <ion-button
            v-if="showContactForm?.freelance"
            size="large"
            fill="clear"
            class="contact-btn"
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
            <ion-card class="testimonial-card">
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

defineProps<Props>();

function openUrl(url: string) {
  window.open(url, "_blank");
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
.final-section {
  padding: 20px 0;
}

.heading-gradient {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    var(--ion-color-primary) 0%,
    var(--ion-color-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse-text 3s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.platform-icon-container {
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.platform-icon-container:hover {
  transform: translateY(-4px);
  filter: drop-shadow(0 4px 12px rgba(var(--ion-color-primary-rgb, 61, 173, 233), 0.4));
}

.platform-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.contact-btn {
  --color: var(--ion-color-primary);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.contact-btn:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px var(--ion-color-primary));
}

.testimonial-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.swiper-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.swiper-pagination-bullet-active {
  --swiper-pagination-color: var(--ion-color-primary);
}
</style>