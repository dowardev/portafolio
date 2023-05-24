<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="closeModal()"
          ><ion-icon :icon="closeOutline"></ion-icon
        ></ion-button>
      </ion-buttons>

      <ion-title>Contenido</ion-title>

      <ion-butons slot="end">
        <ion-chip outline>Beta</ion-chip>
      </ion-butons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <div
      v-for="element in props.indexContent"
      :key="element.id"
      style="margin-bottom: 10px"
    >
      <div
        :class="{
          h3Button: element.type == 'h3',
          h4Button: element.type == 'h4',
          h5Button: element.type == 'h5',
          h6Button: element.type == 'h6',
        }"
      >
        <span
          style="color: var(--ion-color-primary); cursor: pointer"
          @click="goToSection({ id: element.id })"
          >{{ element.name }}</span
        >
      </div>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { closeOutline } from "ionicons/icons";
import { modalController } from "@ionic/vue";

const props = defineProps({
  indexContent: {
    type: Array<{ id: string; type: string; name: string }>,
    default: [],
  },
});

// functions
function goToSection(params: { id: string }) {
  const id = params.id;
  modalController.dismiss({ elementId: id }, "confirm");
}

function closeModal() {
  modalController.dismiss();
}
</script>

<style scoped>
.indexContent > #indexContent {
  word-wrap: break-word;
}

.h3Button {
  margin-left: 10px;
}

.h4Button {
  margin-left: 15px;
}

.h5Button {
  margin-left: 20px;
}

.h6Button {
  margin-left: 25px;
}
</style>
