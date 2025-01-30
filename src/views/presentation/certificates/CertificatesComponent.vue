<template>
  <ion-row>
    <ion-col v-for="(certifcate, index) in certificates" :key="index" size="4">
      <ion-card class="shadow-1">
        <ion-card-header>
          <div style="display: flex; justify-content: space-between">
            <img :src="certifcate.img" alt="" style="height: 45px" />

            <ion-button
              size="small"
              fill="clear"
              @click="
                openUrl({
                  url: certifcate.url,
                })
              "
            >
              <ion-icon :icon="openOutline"> </ion-icon>
            </ion-button>
          </div>

          <ion-card-title>
            {{ certifcate.title }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-row>
            <ion-col size="10" style="display: flex">
              <div
                v-for="(tech, techIndex) in certifcate.aptitudes"
                :key="techIndex"
                style="display: flex; align-items: center; margin-right: 10px"
              >
                <img
                  v-if="tech.type === 'img'"
                  :src="tech.source"
                  :alt="tech.name"
                  :style="{ width: tech.size }"
                />

                <ion-icon
                  v-if="tech.type == 'icon'"
                  :style="{ fontSize: tech.size }"
                  :icon="tech.source"
                ></ion-icon>
              </div>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script lang="ts" setup>
import { openOutline } from "ionicons/icons";

// media
import SkilValueLogo from "@/assets/otros/skillvalue.svg";
import { logoJavascript } from "ionicons/icons";

// vars
const certificates = [
  {
    img: SkilValueLogo,
    title: "SkillValue",
    url: "https://skillvalue.com/en/certificate/4xHm8KSctkDyB5V8SBWzvOBsCZXBKRAZL65rDKazVAV4EPs09nUUvtx9bHki",
    aptitudes: [
      {
        source: logoJavascript,
        name: "JavaScript",
        type: "icon",
        size: "18px",
      },
    ],
  },
];

// functions
function openUrl(params: { url: string }) {
  const { url } = params;
  window.open(url, "_blank");
}
</script>
