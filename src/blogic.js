import router from './router'
import _axios from 'axios'
import {ElMessage} from 'element-plus'

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
    return context.token?true:false  
}

function logout() {
    storeContext({})
    toLoginView()
}

function toLoginView() {
    router.push('/login')
}

function login(req) {
    return axios.post('/login', req);
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
    console.log(res)
    if(res.status === 200) {
        res.data.elMessage = function() {
            if(res.data.code > 0) {
                ElMessage('服务异常：' + res.data.codeDesc);
            }
        }
        if(res.data.code === 401) {
            ElMessage('请重新登录')
            router.push('/login')
            return null;
        }
        return res.data;
    }else {
        ElMessage('请求异常' + res.statusText)
        return null;
    }
}, function (error) {
    console.log(error)
    ElMessage('请求异常')
    return Promise.reject(error)
})

export {
    loadContext,
    storeContext,
    isLogin,
    logout,
    toLoginView,
    login,
}

export const axios = axiosInstance