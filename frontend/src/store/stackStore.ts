import { defineStore } from "pinia";
import { ref } from "vue";

interface StackItem {
  id?: string;
  name: string;
  image: string;
}

export const useStackStore = defineStore("stack", () => {
  const stack = ref<StackItem[]>([]);
  const loading = ref(false);

  function setStack(data: StackItem[]) {
    stack.value = data;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  return {
    stack,
    loading,
    setStack,
    setLoading,
  };
});