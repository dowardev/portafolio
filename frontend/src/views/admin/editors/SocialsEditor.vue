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

    
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import IconSelector, { IconItem } from "@/components/admin/IconSelector.vue";

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
  localItems.value = localItems.value.filter((_, i) => i !== index);
}
</script>