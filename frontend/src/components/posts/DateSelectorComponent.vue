<template>
  <ion-button fill="clear" :disabled="loading" @click="openPopover">
    <ion-label>{{ displayLabel }}</ion-label>
    <ion-icon slot="end" :icon="caretDownOutline"></ion-icon>
  </ion-button>

  <ion-popover :is-open="isPopoverOpen" :event="popoverEvent" @did-dismiss="isPopoverOpen = false">
    <ion-content class="ion-padding">
      <template v-if="viewMode === 'years'">
        <div class="picker-header">
          <ion-text class="picker-title">Seleccionar año</ion-text>
        </div>
        <ion-list lines="none">
          <ion-item
            v-for="year in availableYears"
            :key="year"
            :detail="false"
            button
            @click="selectYear({ year })"
          >
            <ion-label>{{ year }}</ion-label>
          </ion-item>
          <ion-item v-if="availableYears.length === 0" lines="none">
            <ion-label class="ion-text-center" color="medium">Sin fechas disponibles</ion-label>
          </ion-item>
        </ion-list>
      </template>

      <template v-else-if="viewMode === 'months'">
        <div class="picker-header">
          <ion-button fill="clear" size="small" @click="viewMode = 'years'">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
          <ion-text class="picker-title">{{ pickerYear }}</ion-text>
        </div>
        <ion-list lines="none">
          <ion-item
            v-for="month in monthsInYear"
            :key="month.num"
            :detail="false"
            button
            @click="selectMonth({ month: month.num })"
          >
            <ion-label>{{ month.name }}</ion-label>
          </ion-item>
          <ion-item v-if="monthsInYear.length === 0" lines="none">
            <ion-label class="ion-text-center" color="medium">Sin posts este año</ion-label>
          </ion-item>
        </ion-list>
      </template>

      <template v-else>
        <div class="month-nav">
          <ion-button fill="clear" size="small" @click="previousMonth">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>

          <div class="month-year-label clickable" @click="viewMode = 'years'">
            {{ monthYearLabel }}
          </div>

          <ion-button fill="clear" size="small" @click="nextMonth">
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>
        </div>

        <ion-list class="date-list" lines="full">
          <ion-item
            v-for="date in datesInMonth"
            :key="date"
            :detail="false"
            button
            :class="{ 'selected-date': date === selectedDate }"
            @click="selectDate({ date })"
          >
            <ion-label>{{ formatDate({ date }) }}</ion-label>
          </ion-item>

          <ion-item v-if="datesInMonth.length === 0" lines="none">
            <ion-label class="ion-text-center" color="medium">Sin posts en este mes</ion-label>
          </ion-item>
        </ion-list>
      </template>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonText } from "@ionic/vue";
import { chevronBackOutline, chevronForwardOutline, caretDownOutline } from "ionicons/icons";
import { computed, reactive, ref, watch } from "vue";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

import PostController from "@/controllers/postController";
const postController = new PostController();

defineProps<{ loading: boolean }>()
const emits = defineEmits<{ currentDateChange: [] }>()

const isPopoverOpen = ref(false);
const popoverEvent = ref<Event | undefined>();
const allDates = reactive([] as Array<string>);
const selectedDate = ref("");
const hoverYearMonth = ref("");
const viewMode = ref<'dates' | 'years' | 'months'>('dates');
const pickerYear = ref("");

watch(
  () => postController.getDates(),
  (newValue) => {
    allDates.length = 0;
    allDates.push(...(newValue ?? []));
  },
  { immediate: true },
);

watch(
  () => postController.getCurrentPage(),
  (newValue) => {
    selectedDate.value = newValue ?? "";
    if (selectedDate.value) {
      hoverYearMonth.value = selectedDate.value.substring(0, 7);
    }
  },
  { immediate: true },
);

const displayLabel = computed(() => {
  if (!selectedDate.value) return "";
  return format(parse(selectedDate.value, "yyyy-MM-dd", new Date()), "d MMM yyyy", { locale: es });
});

const monthYearLabel = computed(() => {
  if (!hoverYearMonth.value) return "";
  return format(parse(hoverYearMonth.value + "-01", "yyyy-MM-dd", new Date()), "MMMM yyyy", { locale: es });
});

const datesInMonth = computed(() => {
  return allDates.filter((d) => d.startsWith(hoverYearMonth.value));
});

const availableYears = computed(() => {
  const years = new Set<string>();
  for (const date of allDates) {
    years.add(date.substring(0, 4));
  }
  return [...years].sort((a, b) => Number(b) - Number(a));
});

const monthsInYear = computed(() => {
  if (!pickerYear.value) return [];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const months = new Set<number>();
  for (const date of allDates) {
    if (date.startsWith(pickerYear.value + "-")) {
      months.add(Number(date.substring(5, 7)));
    }
  }
  return [...months].sort((a, b) => a - b).map((m) => ({ num: m, name: monthNames[m - 1] }));
});

function previousMonth() {
  const [year, month] = hoverYearMonth.value.split("-").map(Number);
  const date = new Date(year, month - 2, 1);
  hoverYearMonth.value = format(date, "yyyy-MM");
}

function nextMonth() {
  const [year, month] = hoverYearMonth.value.split("-").map(Number);
  const date = new Date(year, month, 1);
  hoverYearMonth.value = format(date, "yyyy-MM");
}

function formatDate(params: { date: string }) {
  const { date } = params;
  return format(parse(date, "yyyy-MM-dd", new Date()), "d MMM", { locale: es });
}

function openPopover(event: Event) {
  popoverEvent.value = event;
  viewMode.value = 'dates';
  isPopoverOpen.value = true;
}

function selectYear(params: { year: string }) {
  const { year } = params;
  pickerYear.value = year;
  viewMode.value = 'months';
}

function selectMonth(params: { month: number }) {
  const { month } = params;
  const monthStr = String(month).padStart(2, "0");
  hoverYearMonth.value = `${pickerYear.value}-${monthStr}`;
  viewMode.value = 'dates';
}

function selectDate(params: { date: string }) {
  const { date } = params;
  postController.updateCurrentPage({ currentPage: date });
  isPopoverOpen.value = false;
  emits("currentDateChange");
}
</script>

<style scoped>
.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.month-year-label {
  font-weight: 600;
  font-size: 1.1rem;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  opacity: 0.7;
}

.picker-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.picker-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.date-list {
  max-height: 300px;
  overflow-y: auto;
}

.selected-date {
  --background: var(--ion-color-primary-tint, rgba(66, 140, 255, 0.1));
  font-weight: 600;
}
</style>
