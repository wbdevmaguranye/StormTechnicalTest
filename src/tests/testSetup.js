import { createApp } from 'vue'
import { createPinia } from 'pinia'

export function createTestApp() {
  const app = createApp({})
  const pinia = createPinia()
  app.use(pinia)
  return { app, pinia }
}
