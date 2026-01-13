<template>
  <div>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button
          menu="mainMenu"
          :smode="modeDesingElements"
        ></ion-menu-button>
      </ion-buttons>

      <ion-title v-if="isPlatform('desktop') || isPlatform('tablet')">
        {{ props.pageTitle }}
      </ion-title>

      <ion-buttons slot="end">
        <ion-segment
          :value="props.mainSegment"
          :mode="modeDesingElements"
          scrollable
          class="main-section"
          @ion-change="emits('mainSegment', $event.detail.value as string)"
        >
          <ion-segment-button value="login">
            <ion-label>Iniciar sesión</ion-label>
          </ion-segment-button>

          <ion-segment-button value="signup">
            <ion-label>Registrar</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>
  </div>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonLabel,
  isPlatform,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";

// vars
const props = defineProps({
  mainSegment: { type: String, default: "login", required: true },
  pageTitle: { type: String, required: true, default: "Iniciar sesión" },
});
const emits = defineEmits(["mainSegment"]);
const modeDesingElements = isPlatform("ios") ? "ios" : "md";
</script>

<style scoped>
.imagen-usuario {
  border-radius: 50%;
  width: 90px;
}
.center-vertical-card-login {
  align-items: center;
  height: 83vh;
}
.img-fondo {
  width: 100%;
  height: 50%;
  position: absolute;
}
.card-form {
  margin-bottom: 18vh;
}
.main-content {
  --wallpaper-main-content: url("https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg");
  --wallpaper-opacity: 0.8;
}
@media only screen and (min-width: 768px) {
  .img-fondo {
    width: 100%;
    height: 40%;
    position: absolute;
  }
  .card-form {
    margin-top: 0;
  }
  .main-section {
    float: right;
  }
}
@media only screen and (min-width: 992px) {
  .img-fondo {
    width: 100%;
    height: auto;
    position: absolute;
  }
  .card-form {
    margin-top: 12vh;
  }
}
@media only screen and (min-width: 1200px) {
  .img-fondo {
    width: 100%;
    height: 50%;
    position: absolute;
  }
  .card-form {
    margin-top: 4vh;
  }
}
</style>
