<template>
  <IconSelector
    :model-value="modelValue"
    @update:model-value="handleUpdate"
    type="tech"
    title="Tecnologías"
    placeholder="Seleccionar tecnología"
    @add="handleAdd"
    @remove="handleRemove"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconSelector from "@/components/admin/IconSelector.vue";

export interface TechItem {
  iconName: string;
}

const props = defineProps<{
  modelValue: TechItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TechItem[]): void;
}>();

function handleUpdate(value: TechItem[]) {
  const newArray = [...value];
  modelValue.value = newArray;
}

const modelValue = ref<TechItem[]>([...(props.modelValue || [])]);

function handleAdd() {
  modelValue.value = [...modelValue.value, { iconName: "" }];
}

function handleRemove(index: number) {
  const newArray = modelValue.value.filter((_, i) => i !== index);
  modelValue.value = newArray;
}

defineExpose({
  modelValue
});
</script>