<template>
  <HomeTemplate1 v-if="currentTemplate === 'template1'" />
  <HomeTemplate3 v-else-if="currentTemplate === 'template3'" />
  <HomeTemplate2 v-else />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useSystemStore } from "@/store/systemStore"

import HomeTemplate1 from "@/templates/HomeTemplate1.vue"
import HomeTemplate2 from "@/templates/HomeTemplate2.vue"
import HomeTemplate3 from "@/templates/HomeTemplate3.vue"

const systemStore = useSystemStore()

const currentTemplate = computed(() => systemStore.getTemplate())
</script>
