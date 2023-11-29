import {useRouter} from 'vue-router'
import axios from 'axios'

const router = useRouter()

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

const axiosInstance = axios.create({
    baseURL: 'http://localhost:6666',
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
    companies: [{
        companyId:1,
        companyName:"公司1",
        products:[{
            productId:1,
            productName:'项目1'
        },{
            productId:2,
            productName:'项目2'
        }]
    },{
        companyId:2,
        companyName:"公司2",
        products:[{
            productId:3,
            productName:'项目3'
        },{
            productId:4,
            productName:'项目4'
        }]
    }],
    currentCompany: {
        companyId:1,
        companyName:"公司1",
        products:[{
            productId:1,
            productName:'项目1'
        },{
            productId:2,
            productName:'项目2'
        }]
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