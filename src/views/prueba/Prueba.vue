<template>
  <ion-page mode="ios">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title
          >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates,
          unde incidunt. Velit nisi suscipit architecto aspernatur corporis iure
          iste rerum. Inventore voluptates reiciendis minima corporis
          accusantium praesentium distinctio neque rerum.</ion-title
        >
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large"
            ><div style="text-wrap: auto">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo
              porro, laborum asperiores dolore mollitia illum. Quaerat ab
              tempore placeat eos aliquam eveniet, et est delectus ad nobis
              soluta dolorem debitis?
            </div></ion-title
          >
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">Scroll the list to see the title collapse.</div>

      <ion-list>
        <ion-item>Item 1</ion-item>
        <ion-item>Item 2</ion-item>
        <ion-item>Item 3</ion-item>
        <ion-item>Item 4</ion-item>
        <ion-item>Item 5</ion-item>
        <ion-item>Item 6</ion-item>
        <ion-item>Item 7</ion-item>
        <ion-item>Item 8</ion-item>
        <ion-item>Item 9</ion-item>
        <ion-item>Item 10</ion-item>
        <ion-item>Item 11</ion-item>
        <ion-item>Item 12</ion-item>
        <ion-item>Item 13</ion-item>
        <ion-item>Item 14</ion-item>
        <ion-item>Item 15</ion-item>
        <ion-item>Item 16</ion-item>
        <ion-item>Item 17</ion-item>
        <ion-item>Item 18</ion-item>
        <ion-item>Item 19</ion-item>
        <ion-item>Item 20</ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonContent, IonHeader, IonTitle, IonToolbar },
});
</script>
