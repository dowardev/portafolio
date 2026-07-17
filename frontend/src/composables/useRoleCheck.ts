import { computed, toValue, type MaybeRefOrGetter, type ComputedRef } from 'vue'
import { useUserStore } from '@/store/userStore'

export function useRoleCheck(slug: MaybeRefOrGetter<string>): ComputedRef<boolean> {
  const userStore = useUserStore()
  return computed(() => userStore.roles.includes(toValue(slug)))
}
