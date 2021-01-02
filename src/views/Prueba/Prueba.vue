<template>
  <ion-app>
    <ion-content class="contenido-historia"> </ion-content>
  </ion-app>
</template>

<script>
import { IonContent } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonContent,
  },
  data() {
    return {
      edad: 0,
    };
  },
});
</script>
