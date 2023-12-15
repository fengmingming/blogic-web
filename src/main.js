import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import CKEditor from '@ckeditor/ckeditor5-vue'
import 'element-plus/dist/index.css'

//创建app
const app = createApp(App)
app.use(router).use(ElementPlus, {locale: zhCn}).use(CKEditor)
app.mount('#app')