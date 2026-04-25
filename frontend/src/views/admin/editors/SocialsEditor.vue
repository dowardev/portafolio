<template>
  <div>
    <IconSelector
      v-model="localItems"
      type="social"
      title="Redes sociales"
      placeholder="Seleccionar plataforma"
      show-url-input
      @add="addItem"
      @remove="removeItem"
    />

    <ion-list v-if="localItems.length > 0">
      <ion-list-header>
        <ion-label>Validación</ion-label>
      </ion-list-header>

      <ion-card
        v-for="(item, index) in localItems"
        :key="`valid-${index}`"
        class="shadow1"
      >
        <ion-item lines="full">
          <ion-input
            v-model="item.url"
            label="URL del perfil"
            label-placement="floating"
            placeholder="https://..."
            type="url"
            :error-text="getError({ index, field: 'url' })"
            :class="{
              'ion-invalid': hasError({ index, field: 'url' }),
              'ion-touched': touched[index]?.url,
            }"
            @ion-input="updateItem(index, { url: $event.detail.value }); touchField({ index, field: 'url' })"
            @ion-blur="touchField({ index, field: 'url' })"
          ></ion-input>
        </ion-item>
      </ion-card>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import {
  IonList,
  IonListHeader,
  IonLabel,
  IonCard,
  IonItem,
  IonInput,
} from "@ionic/vue";
import { computed, reactive, ref, watch } from "vue";
import IconSelector, { IconItem } from "@/components/admin/IconSelector.vue";
import useVuelidate from "@vuelidate/core";
import { required, url as urlValidator, helpers } from "@vuelidate/validators";

export interface SocialItem {
  platform: string;
  url: string;
  iconName: string;
}

const props = defineProps<{
  modelValue: SocialItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SocialItem[]): void;
}>();

const localItems = ref<IconItem[]>([]);

watch(
  () => props.modelValue,
  (newVal) => {
    localItems.value = newVal.map((item) => ({
      iconName: item.iconName,
      url: item.url,
    }));
  },
  { immediate: true }
);

watch(
  localItems,
  (newVal) => {
    emit(
      "update:modelValue",
      newVal.map((item) => ({
        platform: item.iconName,
        url: item.url || "",
        iconName: item.iconName,
      }))
    );
  },
  { deep: true }
);

function addItem() {
  localItems.value = [...localItems.value, { iconName: "", url: "" }];
}

function removeItem(index: number) {
  delete touched[index];
  localItems.value = localItems.value.filter((_, i) => i !== index);
}

function updateItem(index: number, updates: Partial<IconItem>) {
  localItems.value[index] = { ...localItems.value[index], ...updates };
}

const touched = reactive<Record<number, Record<string, boolean>>>({});

const rules = {
  items: {
    $each: helpers.forEach({
      url: {
        required: helpers.withMessage("La URL es requerida", required),
        url: helpers.withMessage("Debe ser una URL válida", urlValidator),
      },
    }),
  },
};

const v$ = useVuelidate(rules, {
  items: computed(() => localItems.value.filter((i) => i.iconName)),
});

function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors =
    v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors =
    v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

defineExpose({ allValid: computed(() => {
  if (localItems.value.filter((i) => i.iconName).length === 0) return true;
  return !v$.value.$invalid;
}) });
</script>