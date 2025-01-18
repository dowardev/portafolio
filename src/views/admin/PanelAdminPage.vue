<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-menu-button
          menu="mainMenu"
          :mode="designElements"
        ></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end">
        <ion-segment
          v-if="
            screenSize.preset == 'md' ||
            screenSize.preset == 'lg' ||
            screenSize.preset == 'xxl'
          "
          :value="mainSegment"
          :mode="designElements"
          scrollable
          @ion-change="mainSegment = $event.detail.value?.toString() || ''"
        >
          <ion-segment-button value="posts">
            <ion-label>Posts</ion-label>
          </ion-segment-button>

          <ion-segment-button value="users">
            <ion-label>Usuarios</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- button options -->
        <ion-button
          v-else
          :mode="designElements"
          @click="
            popoverMainOptions.event = $event;
            popoverMainOptions.open = true;
          "
        >
          <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="container-page">
    <section v-if="mainSegment == 'users'">
      <UsersComponent
        @on-content-loaded="
          toggleLoader({ show: $event == true ? false : true })
        "
      />
    </section>

    <!-- popovers -->
    <!-- popover main options -->
    <ion-popover
      :is-open="popoverMainOptions.open"
      :event="popoverMainOptions.event"
      @did-dismiss="popoverMainOptions.open = false"
    >
      <ion-content>
        <ion-item button @click="mainSegment = 'users'">
          <ion-label>Posts</ion-label>
        </ion-item>

        <ion-item button @click="mainSegment = 'users'">
          <ion-label>Usuarios</ion-label>
        </ion-item>
      </ion-content>
    </ion-popover>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  isPlatform,
  IonPopover,
} from "@ionic/vue";
import { onMounted, reactive, ref, watch } from "vue";
import UsersComponent from "./users/UsersComponent.vue";

// controllers
import SystemController from "@/controllers/systemController";
import { ellipsisVerticalOutline } from "ionicons/icons";
const systemController = new SystemController();

// vars
const pageTitle = "Panel Administrador";
const mainSegment = ref("users");
const designElements = isPlatform("ios") ? "ios" : "md";
const screenSize = ref(systemController.getScreenSize());
const popoverMainOptions = reactive({ open: false, event: Event });

onMounted(() => {
  toggleLoader({ show: true });
});
watch(systemController.getScreenSize(), (newVal) => {
  screenSize.value = newVal;
});

// functions
function toggleLoader(params: { show: boolean }) {
  const { show } = params;
  if (show) {
    systemController.enableLoader({ color: "primary" });
  } else {
    systemController.disableLoader();
  }
}
</script>
