<template>
  <HomeTemplate1 v-if="currentTemplate === 'template1'" />
  <HomeTemplate3 v-else-if="currentTemplate === 'template3'" />
  <HomeTemplate2 v-else />
</template>

<script setup lang="ts">
import { computed } from "vue"

// controllers
import SystemController from "@/controllers/systemController"
const systemController = new SystemController()

import HomeTemplate1 from "@/templates/HomeTemplate1.vue"
import HomeTemplate2 from "@/templates/HomeTemplate2.vue"
import HomeTemplate3 from "@/templates/HomeTemplate3.vue"

const currentTemplate = computed(() => systemController.getTemplate())
</script>
