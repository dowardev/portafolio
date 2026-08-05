import { createPinia, setActivePinia } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { describe, expect, test, beforeEach } from 'vitest'

describe('systemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('getTemplate returns the default template', () => {
    const store = useSystemStore()
    expect(store.getTemplate()).toBe('template3')
  })

  test('setTemplate updates the selected template', () => {
    const store = useSystemStore()
    store.setTemplate({ template: 'template1' })
    expect(store.getTemplate()).toBe('template1')
  })
})
