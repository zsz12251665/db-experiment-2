import { createApp } from 'vue'
import App from './App.vue'
import { ipcRenderer } from 'electron'
import router from './router'
import ElementPlus from 'element-plus'
import './element-variables.scss'

const app = createApp(App).use(router).use(ElementPlus);

app.config.globalProperties.$sql = async (...args) => {
	ipcRenderer.send('sql-query', ...args);
	return new Promise(resolve => ipcRenderer.on('sql-result', (event, res) => resolve(res)));
};

app.mount('#app');
