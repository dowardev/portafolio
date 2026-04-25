<template>
  <IconSelector
    v-model="localItems"
    type="tech"
    title="Tecnologías"
    placeholder="Seleccionar tecnología"
    @add="addItem"
    @remove="removeItem"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import IconSelector, { IconItem } from "@/components/admin/IconSelector.vue";

export interface TechItem {
  iconName: string;
}

const props = defineProps<{
  modelValue: TechItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TechItem[]): void;
}>();

const localItems = ref<IconItem[]>([]);

watch(
  () => props.modelValue,
  (newVal) => {
    localItems.value = newVal.map((item) => ({
      iconName: item.iconName,
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
        iconName: item.iconName,
      }))
    );
  },
  { deep: true }
);

function addItem() {
  localItems.value = [...localItems.value, { iconName: "" }];
}

function removeItem(index: number) {
  localItems.value = localItems.value.filter((_, i) => i !== index);
}
</script>