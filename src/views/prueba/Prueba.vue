<template>
  <ion-page>
    <ion-header collapse="fade" mode="ios" :translucent="true">
      <ion-toolbar>
        <ion-title>Header</ion-title>
        <ion-buttons slot="end">
          <ion-button>sss</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <MdEditor v-model="text" :language="'en-US'" :toolbar="[]" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const text = ref("# Hola Editor");
</script>
