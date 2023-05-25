<template>
  <ion-page :class="{ 'component-container': isPlatform('desktop') }">
    <MqResponsive target="lg+">
      <MenuCollapsed v-if="detectMenuCollapse().value == true" />
      <DefaultMenuComponent v-if="detectMenuCollapse().value == false" />
    </MqResponsive>

    <MqResponsive target="md-">
      <DefaultMenuComponent  />
    </MqResponsive>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, isPlatform } from "@ionic/vue";
import { useSystem } from "../../composables/useSystem";
import DefaultMenuComponent from "./default_menu/DefaultMenuComponent.vue";
import MenuCollapsed from "./menu_collapsed/MenuCollapsedComponent.vue";
import { MqResponsive } from "vue3-mq";

const detectMenuCollapse = useSystem().detectMenuCollapse;
</script>
