import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primevue/themes/material'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import Toast from 'primevue/toast'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: 'light',
    },
  },
})
app.use(ToastService)
app.use(router)

app.component('Toast', Toast)

app.mount('#app')
