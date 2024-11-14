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
import { reactive, ref, watch } from "vue";
import { usePost } from "../../controllers/postController";

const emits = defineEmits(["currentDateChange"]);

const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "ios" | "md");

let dates = reactive([] as Array<string>);
const currentDate = ref("");
const index = ref();
const currentDateIndex = ref(0);

// hooks
watch(
  () => usePost().getDates(),
  (newValue) => {
    dates = newValue as any;
  }
);
watch(
  () => usePost().getCurrentPage(),
  (newValue) => {
    currentDate.value = newValue as string;
  }
);
watch(
  () => dates,
  (newValue) => {
    index.value = newValue.indexOf(currentDate.value);
    currentDateIndex.value = index.value;
  }
);

// functions
function nextDate(): void {
  const newDateIndex = +currentDateIndex.value + 1;

  if (newDateIndex >= dates.length) return;

  currentDate.value = dates[newDateIndex];
  currentDateIndex.value = newDateIndex;

  updateCurrentDate();
  emits("currentDateChange");
}

function previousDate(): void {
  const newDateIndex = +currentDateIndex.value - 1;

  if (newDateIndex < 0) return;

  currentDate.value = dates[newDateIndex];
  currentDateIndex.value = newDateIndex;

  updateCurrentDate();
  emits("currentDateChange");
}

function selectDate(params: { date: string }): void {
  const date = params.date;
  currentDateIndex.value = dates.indexOf(date);
  updateCurrentDate();
  emits("currentDateChange");
}

function updateCurrentDate(): void {
  usePost().updateCurrentPage({ currentPage: currentDate.value });
}
</script>
