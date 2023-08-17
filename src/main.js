import './assets/main.css'
import 'font-awesome/css/font-awesome.min.css';
import Notifications from '@kyvg/vue3-notification'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'  

const app = createApp(App)
app.use(router)
app.use(store)  
app.use(Notifications);
app.mount('#app')