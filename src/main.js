import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const global = app.config.globalProperties;
global.loadContext = function() {
    let context = localStorage.context;
    if(context) {
        return JSON.parse(context)
    }
}
global.storeContext = function(context) {
    localStorage.context = JSON.stringify(context);
}

app.use(router)
app.mount('#app')
