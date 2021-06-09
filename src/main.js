import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import sql from './sql'
import './element-variables.scss'

const app = createApp(App).use(router).use(ElementPlus);

app.config.globalProperties.$sql = sql;

app.mount('#app');
