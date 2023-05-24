<template>
  <ion-page :class="{ 'component-container': isPlatform('desktop') }">
    <DefaultMenuComponent v-if="detectMenuCollapse().value == false" />
    <MenuCollapsed v-if="detectMenuCollapse().value == true" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, isPlatform } from "@ionic/vue";
import { useSystem } from "../../composables/useSystem";
import DefaultMenuComponent from "./default_menu/DefaultMenuComponent.vue";
import MenuCollapsed from "./menu_collapsed/MenuCollapsedComponent.vue";

const detectMenuCollapse = useSystem().detectMenuCollapse;
</script>
