<template>
  <ion-page>
    <DefaultMenuComponent v-if="detectMenuCollapse().value == false" />
    <MenuCollapsed v-if="detectMenuCollapse().value == true" />
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IonContent, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { useSystem } from "../../composables/useSystem";
import DefaultMenuComponent from "./default_menu/DefaultMenuComponent.vue";
import MenuCollapsed from "./menu_collapsed/MenuCollapsedComponent.vue";

export default defineComponent({
  name: "MenuComponent",
  components: {
    IonContent,
    IonPage,
    DefaultMenuComponent,
    MenuCollapsed,
  },

  setup() {
    return {
      detectMenuCollapse: useSystem().detectMenuCollapse,
    };
  },
});
</script>
