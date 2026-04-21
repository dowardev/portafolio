<template>
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
          v-for="platform in freelance"
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
    <ion-col>
      <Swiper
        :modules="[Pagination, Navigation, Autoplay]"
        :slides-per-view="slidesPerView"
        :loop="true"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
      >
        <template v-for="platform in freelance" :key="platform.name">
          <SwiperSlide
            v-if="platform.comment"
            :key="`${platform.name}-comment`"
          >
            <ion-card class="shadow-1">
              <ion-item lines="full">
                <ion-thumbnail slot="start">
                  <img
                    :src="platform.image"
                    :alt="platform.name"
                    style="height: 45px"
                  />
                </ion-thumbnail>

                <ion-label>
                  <h2>{{ platform.comment.title }}</h2>

                  <div>
                    <ion-icon
                      v-for="n in platform.comment.rating"
                      :key="n"
                      :icon="starIcon"
                      style="color: gold; font-size: 16px"
                    ></ion-icon>
                  </div>
                </ion-label>
              </ion-item>

              <div class="ion-padding-start">
                <div
                  v-if="platform.comment.text"
                  style="max-height: 200px; overflow: auto"
                >
                  <p>{{ platform.comment.text }}</p>
                </div>
              </div>
            </ion-card>
          </SwiperSlide>
        </template>
      </Swiper>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonIcon,
} from "@ionic/vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { type FreelanceItem } from "@/services/types";
import { type ScreenSize } from "@/utils/types/homeTemplate";
import { mail, star as starIcon } from "ionicons/icons";

import ContractLogo from "@/assets/otros/contract-svgrepo-com.svg";

interface Props {
  freelance?: FreelanceItem[];
  showContactForm?: {
    socials?: boolean;
    freelance?: boolean;
  };
  screenSize?: ScreenSize;
}

const props = defineProps<Props>();

const slidesPerView = computed(() => {
  const preset = props.screenSize?.preset;
  return preset === "xs" || preset === "md" ? 1 : 2;
});

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
