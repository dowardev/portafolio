<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <ion-button fill="clear" @click="previousDate">
      <ion-icon :icon="chevronBackOutline"></ion-icon>
    </ion-button>

    <ion-select
      v-model="currentDate"
      :mode="modeDesingElements"
      ok-text='Confirmar'
      cancel-text='Cancelar'
      @ion-change="selectDate({ date: $event.detail.value })"
    >
      <ion-select-option
        v-for="(date, index) in dates"
        :key="index"
        :value="date"
      >
        {{ date }}</ion-select-option
      >
    </ion-select>

    <!-- next date -->
    <ion-button fill="clear" @click="nextDate">
      <ion-icon :icon="chevronForwardOutline"></ion-icon>
    </ion-button>
  </div>
</template>

<script lang="ts">
import { IonSelect, IonSelectOption, isPlatform } from "@ionic/vue";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { defineComponent } from "vue";
import { usePost } from "../../composables/usePost";

export default defineComponent({
  name: "DateSelectorComponent",
  components: { IonSelect, IonSelectOption },
  emits: ["currentDateChange"],

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      chevronBackOutline,
      chevronForwardOutline,
      usePost: usePost(),
      modeDesingElements,
    };
  },

  data() {
    const dates = usePost().getDates()!;
    const currentDate = usePost().getCurrentPage() as string;
    const index = dates.indexOf(currentDate);
    const currentDateIndex = index;
    return {
      dates,
      currentDate,
      currentDateIndex,
    };
  },

  methods: {
    nextDate() {
      let currentDateIndex = this.currentDateIndex;
      let newDateIndex = +currentDateIndex + 1;
      const dates = this.dates;

      if (newDateIndex >= dates.length) return;

      this.currentDate = dates[newDateIndex];
      this.currentDateIndex = newDateIndex;

      this.updateCurrentDate();
      this.$emit("currentDateChange");
    },

    previousDate() {
      let currentDateIndex = this.currentDateIndex;
      let newDateIndex = +currentDateIndex - 1;
      const dates = this.dates;

      if (newDateIndex < 0) return;

      this.currentDate = dates[newDateIndex];
      this.currentDateIndex = newDateIndex;

      this.updateCurrentDate();
      this.$emit("currentDateChange");
    },

    selectDate(params: { date: string }) {
      const date = params.date;
      this.currentDateIndex = this.dates.indexOf(date);
      this.updateCurrentDate();
      this.$emit("currentDateChange");
    },

    updateCurrentDate() {
      const currentDate = this.currentDate;
      this.usePost.updateCurrentPage({ currentPage: currentDate });
    },
  },
});
</script>
