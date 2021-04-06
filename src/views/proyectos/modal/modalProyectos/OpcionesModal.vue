<template>
  <ion-content>
    <ion-item
      lines="none"
      button
      @click="cerrarModal('repositorio')"
      v-if="repositorio != undefined"
    >
      <ion-label>Repositorio</ion-label>
    </ion-item>
    <ion-item
      lines="none"
      button
      @click="cerrarModal('pagina')"
      v-if="pagina != undefined"
    >
      <ion-label>Sitio web</ion-label>
    </ion-item>
  </ion-content>
</template>

<script>
import { IonContent, popoverController } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Popover",
  components: { IonContent },
  props: {
    repositorio: { type: String, default: "Super Modal" },
    pagina: { type: String, default: "Super Modal" },
  },
  methods: {
    cerrarModal(opcion) {
      popoverController.dismiss({ opcion });
    },
  },
});
</script>

<style scoped>
ion-item {
  --background: #1c1c26;
}
</style>
