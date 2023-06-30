<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <div class="center-vertical">
      <ion-button fill="clear" @click="previousDate">
        <ion-icon :icon="chevronBackOutline"></ion-icon>
      </ion-button>

      <!-- next date -->
      <ion-button fill="clear" @click="nextDate">
        <ion-icon :icon="chevronForwardOutline"></ion-icon>
      </ion-button>
    </div>

    <ion-select
      v-model="currentDate"
      :mode="modeDesingElements"
      ok-text="Confirmar"
      cancel-text="Cancelar"
      interface="popover"
      @ion-change="selectDate({ date: $event.detail.value })"
    >
      <ion-select-option
        v-for="(date, indexDates) in dates"
        :key="indexDates"
        :value="date"
      >
        {{ date }}</ion-select-option
      >
    </ion-select>
  </div>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption, isPlatform } from "@ionic/vue";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { ref } from "vue";
import { usePost } from "../../composables/usePost";

const emits = defineEmits(["currentDateChange"]);

const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "ios" | "md");

const dates = usePost().getDates()!;
const currentDate = ref(usePost().getCurrentPage() as string);
const index = dates.indexOf(currentDate.value);
let currentDateIndex = index;

// functions
function nextDate() {
  let newDateIndex = +currentDateIndex + 1;

  if (newDateIndex >= dates.length) return;

  currentDate.value = dates[newDateIndex];
  currentDateIndex = newDateIndex;

  updateCurrentDate();
  emits("currentDateChange");
}

function previousDate() {
  let newDateIndex = +currentDateIndex - 1;

  if (newDateIndex < 0) return;

  currentDate.value = dates[newDateIndex];
  currentDateIndex = newDateIndex;

  updateCurrentDate();
  emits("currentDateChange");
}

function selectDate(params: { date: string }) {
  const date = params.date;
  currentDateIndex = dates.indexOf(date);
  updateCurrentDate();
  emits("currentDateChange");
}

function updateCurrentDate() {
  usePost().updateCurrentPage({ currentPage: currentDate.value });
}
</script>
