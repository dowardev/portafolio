<template>
  <div
    :class="{
      indexContent: props.autoHideContent,
    }"
  >
    <ion-item class="transparent">
      <ion-label>Contenido</ion-label>
    </ion-item>

    <div
      v-if="props.autoHideContent == true"
      style="display: flex; opacity: 0.5"
      class="ion-padding-start"
    >
      <div
        style="
          margin-right: 16px;
          display: flex;
          align-content: center;
          align-items: center;
        "
      >
        <ion-icon :icon="alertCircleOutline"></ion-icon>
      </div>

      <div style="display: flex; align-content: center; align-items: center">
        <ion-label>Pasa el mouse por encima</ion-label>
      </div>
    </div>

    <div
      id="indexContent"
      style="overflow: auto; height: 70vh"
      class="ion-padding-start"
    >
      <div
        v-for="element in indexContent"
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
            style="cursor: pointer"
            @click="goToSection({ id: element.id })"
            >{{ element.name }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { alertCircleOutline } from "ionicons/icons";
import { defineComponent } from "vue";

const props = defineProps({
  indexContent: {
    type: Array<{ id: string; type: string; name: string }>,
    default: [],
  },
  autoHideContent: { type: Boolean, default: true },
});

const emits = defineEmits(["elementId"]);

// functions
function goToSection(params: { id: string }) {
  const id = params.id;
  emits("elementId", id);
}
</script>

<style scoped>
.indexContent > #indexContent {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  word-wrap: break-word;
}

.indexContent:hover #indexContent {
  opacity: 1;
}

.hidde-scroll::-webkit-scrollbar {
  display: none;
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
