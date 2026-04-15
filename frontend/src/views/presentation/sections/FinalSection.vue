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
            v-for="(review, index) in platform.comments"
            :key="`${platform.name}-${index}`"
          >
            <ion-card class="shadow-1">
              <ion-card-header>
                <div style="display: flex; justify-content:">
                  <img
                    :src="platform.image"
                    :alt="platform.name"
                    style="height: 45px"
                  />
                </div>
                <ion-card-title>{{ review.title }}</ion-card-title>
                <ion-card-subtitle>
                  <ion-icon
                    v-for="n in review.rating"
                    :key="n"
                    :icon="starIcon"
                  ></ion-icon>
                </ion-card-subtitle>
              </ion-card-header>
              <ion-card-content v-if="review.comment && review.comment.length">
                <p>
                  <ion-text>
                    <span
                      v-for="(line, indexComment) in review.comment"
                      :key="indexComment"
                    >
                      {{ line
                      }}<br v-if="indexComment < review.comment.length - 1" />
                    </span>
                  </ion-text>
                </p>
              </ion-card-content>
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

import { type FreelanceItem } from "@/services/homeApi";
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
