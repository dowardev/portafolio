<template>
  <ion-row>
    <ion-col v-for="(certifcate, index) in certificates" :key="index" size="4">
      <ion-card class="shadow-1">
        <ion-card-header>
          <ion-card-title>
            {{ certifcate.title }}
          </ion-card-title>

          <ion-card-subtitle>{{ certifcate.aptitude }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-row>
            <ion-col style="display: flex; justify-content: end">
              <ion-button
                fill="clear"
                @click="
                  openUrl({
                    url: certifcate.url,
                  })
                "
              >
                Ver certificado
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script lang="ts" setup>
// vars
const certificates = [
  {
    title: "SkillValue",
    url: "https://skillvalue.com/en/certificate/4xHm8KSctkDyB5V8SBWzvOBsCZXBKRAZL65rDKazVAV4EPs09nUUvtx9bHki",
    aptitude: "Javascript",
  },
];

// functions
function openUrl(params: { url: string }) {
  const { url } = params;
  window.open(url, "_blank");
}
</script>
