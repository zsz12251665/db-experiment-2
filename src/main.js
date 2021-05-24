import { createApp } from 'vue'
import App from './App.vue'
import { ipcRenderer } from 'electron'


const app = createApp(App);
app.config.globalProperties.$dbQuery = async (mode, ...args) => {
	ipcRenderer.send('db-query', mode, ...args);
	return new Promise(resolve => ipcRenderer.on('db-reply', (event, res) => resolve(res)));
};

app.mount('#app');
