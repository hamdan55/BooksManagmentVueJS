/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@/styles/styles.scss'
import '@core/scss/template/index.scss'
import { initializeApp } from 'firebase/app'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import firebaseConfig from '../firebaseConfigs'

loadFonts()

const firebaseApp = initializeApp(firebaseConfig)

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)


// Mount vue app
app.mount('#app')
