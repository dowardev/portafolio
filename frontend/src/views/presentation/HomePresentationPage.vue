<template>
  <HomeTemplate3 v-if="resolvedTheme === 'cyberpunk-light'" />
  <HomeTemplate2 v-else />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useSystemStore } from "@/store/systemStore"
import SystemController from "@/controllers/systemController"
import { Theme } from "@/utils/interfaces"

import HomeTemplate2 from "@/templates/HomeTemplate2.vue"
import HomeTemplate3 from "@/templates/HomeTemplate3.vue"

const systemStore = useSystemStore()
const systemController = new SystemController()

const resolvedTheme = computed(() => {
  const theme = systemStore.getThemeSelected() as Theme
  return systemController.resolveAutoTheme({ theme })
})
</script>
