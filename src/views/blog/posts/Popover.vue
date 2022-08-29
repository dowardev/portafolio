<template>
  <ion-content>
    <ion-datetime
      ref="datetime"
      :is-date-enabled="getDaysEnabled"
      presentation="date"
      :value="usePost.getCurrentPage()"
      :first-day-of-week="1"
      locale="es-mx"
      @ion-change="
        goToPage({
          date: $event.detail.value as string,
        })
      "
    ></ion-datetime
  ></ion-content>
</template>

<script lang="ts">
import { IonContent, popoverController, IonDatetime } from "@ionic/vue";
import { defineComponent } from "vue";
import { usePost } from "../../../composables/usePost";

export default defineComponent({
  name: "Popover",
  components: { IonContent, IonDatetime },

  setup() {
    return {
      usePost: usePost(),
    };
  },

  methods: {
    goToPage(params: { date: string }) {
      const date = params.date;
      popoverController.dismiss(date);
    },

    getDaysEnabled(date: string): Boolean {
      const dates = this.usePost.getDates()!;
      const result = dates.filter((element) => element.split("T")[0] == date);
      if (result.length > 0) {
        return true;
      }
      return false;
    },
  },
});
</script>
