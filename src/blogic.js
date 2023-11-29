import router from './router'
import _axios from 'axios'

function loadContext() {
    let context = localStorage.context;
    if(context) {
        return JSON.parse(context)
    }
    return context;
}

function storeContext(context) {
    localStorage.context = JSON.stringify(context);
}

function isLogin() {
    let context = loadContext()
    return context?true:false  
}

function logout() {
    storeContext(null)
}

function toLoginView() {
    router.push('/login')
}

const axiosInstance = _axios.create({
    baseURL: 'http://localhost:6060/blogic',
    timeout: 30000
})

axiosInstance.interceptors.request.use(function(config) {
    let context = loadContext()
    if(config.headers) {
        config.headers['Authorization'] = 'Bearer ' + context.token
    }else {
        config.headers = {Authorization: 'Bearer ' + context.token}
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function(res) {
    return res
}, function (error) {
    return Promise.reject(error)
})

storeContext({
    token: '',
    userId: 0,
    companies: [{
        companyId:1,
        companyName:"公司1",
    },{
        companyId:2,
        companyName:"公司2"
    }],
    currentCompany: {
        companyId:1,
        companyName:"公司1"
    }
})

export {
    loadContext,
    storeContext,
    isLogin,
    logout,
    toLoginView,
}

export const axios = axiosInstance