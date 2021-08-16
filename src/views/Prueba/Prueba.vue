<template>
  <ion-page>
    <ion-content :fullscreen="true"> </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonPage, IonContent },
});
</script>
