<template>
  <ion-row style="overflow: auto; max-height: calc(100% - 8dvh)">
    <ion-col
      v-for="(certifcate, index) in certificates"
      :key="index"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card
        class="shadow-1"
        @click="
          openUrl({
            url: certifcate.url,
          })
        "
      >
        <ion-card-header>
          <div style="display: flex; justify-content: space-between">
            <img :src="certifcate.img" alt="" style="height: 45px" />
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
                  :style="{
                    fontSize: tech.size,
                    color: getIconColorByName({ name: tech.name }),
                  }"
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

function getIconColorByName(params: { name: string }) {
  const { name } = params;
  const colors: { [key: string]: string } = {
    Ionic: "#3356c7",
    Vue: "#41b883",
    Laravel: "#ff2819",
    Firebase: "#ffca28",
    Capacitorjs: "#119eff",
    Electronjs: "#47848f",
    Web: "#3356c7",
    Linux: "#000000",
    PWA: "#5905c8",
    Android: "#44ac5a",
    Windows: "#0078d4",
    JavaScript: "#f0db4f",
  };
  return colors[name] || "";
}
</script>
