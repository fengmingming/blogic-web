import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import CKEditor from '@ckeditor/ckeditor5-vue'
import 'element-plus/dist/index.css'

//创建app
const app = createApp(App)
app.use(router).use(CKEditor)
app.mount('#app')