<template>
  <div>
    <ion-item v-if="!selectedUser">
      <ion-label position="stacked">Buscar usuario por nombre o email</ion-label>
      <ion-input
        v-model="searchQuery"
        placeholder="Escribe para buscar..."
        @ion-input="onSearch"
        :debounce="500"
      ></ion-input>
    </ion-item>

    <ion-list v-if="results.length > 0 && showResults" lines="full">
      <ion-item
        v-for="user in results"
        :key="user.id"
        button
        @click="selectUser(user)"
        :detail="false"
      >
        <ion-icon :icon="personOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ user.name }}</h2>
          <p>{{ user.email }}</p>
        </ion-label>
      </ion-item>
    </ion-list>

    <div v-if="selectedUser" class="selected-user">
      <ion-item>
        <ion-icon :icon="checkmarkCircle" slot="start" color="success"></ion-icon>
        <ion-label>
          <h2>{{ selectedUser.name }}</h2>
          <p>{{ selectedUser.email }}</p>
        </ion-label>
        <ion-button
          fill="clear"
          color="medium"
          slot="end"
          @click="clearSelection"
        >
          <ion-icon :icon="close"></ion-icon>
        </ion-button>
      </ion-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IonItem, IonLabel, IonInput, IonList, IonIcon, IonButton } from '@ionic/vue'
import { personOutline, checkmarkCircle, close } from 'ionicons/icons'
import { usePermissionsController } from '@/controllers/permissionsController'
import type { SearchUserResult } from '@/controllers/permissionsController'

const emit = defineEmits<{
  (e: 'selected', user: SearchUserResult | null): void
}>()

const controller = usePermissionsController()

const searchQuery = ref('')
const results = ref<SearchUserResult[]>([])
const showResults = ref(false)
const selectedUser = ref<SearchUserResult | null>(null)

async function onSearch() {
  if (searchQuery.value.length < 2) {
    results.value = []
    showResults.value = false
    return
  }

  const users = await controller.searchUsers({ query: searchQuery.value })
  results.value = users
  showResults.value = true
}

function selectUser(user: SearchUserResult) {
  selectedUser.value = user
  showResults.value = false
  searchQuery.value = ''
  emit('selected', user)
}

function clearSelection() {
  selectedUser.value = null
  emit('selected', null)
}
</script>

<style scoped>
.selected-user {
  margin-top: 12px;
}
</style>