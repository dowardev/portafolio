<template>
  <ion-row>
    <ion-col>
      <ion-card v-for="(share, index) in content" :key="index">
        <ion-card-content>
          <ion-row>
            <ion-col size-xs="12" size-md="4">
              <img :src="share.image" style="width: 20rem" />
            </ion-col>

            <ion-col size-xs="12" size-md="8">
              <ion-row>
                <ion-col size="12">
                  <ion-card-title>
                    {{ share.name }}
                  </ion-card-title>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="12">
                  <ion-text>Enlaces de interes</ion-text>
                </ion-col>

                <ion-col>
                  <ion-button :href="share.url" target="_blank" fill="outline"
                    >Sitio web</ion-button
                  >
                  <ion-button
                    v-if="share.extra!"
                    :href="share.extra![0].urlProfile"
                    target="_blank"
                    fill="outline"
                    >Perfil</ion-button
                  >
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-card-content>

        <ion-accordion-group>
          <ion-accordion value="third">
            <ion-item slot="header">
              <ion-label>Descripcion</ion-label>
            </ion-item>
            <div slot="content" class="ion-padding">
              {{ share.description }}
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonAccordion, IonAccordionGroup, IonButton, IonCard, IonCardContent, IonCardTitle, IonCol, IonItem, IonLabel, IonRow, IonText } from "@ionic/vue";
import { defineComponent } from "vue";

import WorkanaLogo from "../../../assets/otros/Workana_ISOLOGO_W.png";
import InitLogo from "../../../assets/otros/init.png";

const content = [
  {
    name: "Workana",
    image: WorkanaLogo,
    url: "https://workana.com/",
    description: "Plataforma de trabajo para freelancecers.",
    extra: [
      {
        urlProfile:
          "https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c",
      },
    ],
  },
  {
    name: "Init",
    image: InitLogo,
    url: "https://www.youtube.com/@init101",
    description:
      "Canal de YouTube cuyo fin es el difundir conocimiento de cualquier índole.",
  },
];
</script>
