<template>
  <div>
    <IconSelector
      :model-value="socials"
      type="social"
      title="Redes sociales"
      placeholder="Seleccionar plataforma"
      show-url-input
      @update:model-value="handleUpdate"
      @add="handleAdd"
      @remove="handleRemove"
    />
  </div>
</template>

<script setup lang="ts">
import IconSelector, { IconItem } from "@/components/admin/IconSelector.vue";

export interface SocialItem {
  id?: number;
  platform: string;
  url: string;
  iconName: string;
}

const props = defineProps<{
  socials: SocialItem[];
}>();

const emit = defineEmits<{
  "update:socials": [value: SocialItem[]];
}>();

function handleUpdate(value: IconItem[]) {
  emit("update:socials", value.map((item) => ({
    platform: item.iconName,
    url: item.url || "",
    iconName: item.iconName,
  })));
}

function handleAdd() {
  const newSocials = [...props.socials, { platform: "", url: "", iconName: "" }];
  emit("update:socials", newSocials);
}

function handleRemove(index: number) {
  const newSocials = props.socials.filter((_, i) => i !== index);
  emit("update:socials", newSocials);
}
</script>