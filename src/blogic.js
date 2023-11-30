import router from './router'
import _axios from 'axios'
import {ElMessage} from 'element-plus'

class UserContext {
    constructor() {
        this.token = '',
        this.user = {
            userId: null,
            userName: null,
            phone: null
        },
        this.companies = []
    }
}

function loadContext() {
    if(localStorage.key('context')) {
        return JSON.parse(localStorage.getItem('context'))
    }
    return new UserContext();
}

function storeContext(context) {
    localStorage.setItem('context', JSON.stringify(context));
}

function isLogin() {
    let context = loadContext()
    return context.token?true:false  
}

function logout() {
    storeContext(new UserContext())
    toLoginView()
}

function toLoginView() {
    router.push('/login')
}

function login(req) {
    return axios.post('/login', req);
}

function showError(message) {
    ElMessage.error(message)
}

function showWarn(message) {
    ElMessage({
        message: message,
        type: 'warning',
    })
}

function showSuccess(message) {
    ElMessage({
        message: message,
        type: 'success',
    })
}

function showMessage(message) {
    ElMessage(message)
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
        res.data.showCodeDesc = function() {
            if(res.data.code > 0) {
                showError('服务异常：' + res.data.codeDesc);
            }
        }
        if(res.data.code === 401) {
            showWarn({
                message: '请重新登录',
                type: 'warning'
            })
            toLoginView()
            return null;
        }
        return res.data;
    }else {
        showError('请求异常' + res.statusText)
        return null;
    }
}, function (error) {
    console.log(error)
    showError('请求异常')
    return Promise.reject(error)
})

export {
    loadContext,
    storeContext,
    isLogin,
    logout,
    toLoginView,
    login,
    showError,
    showWarn,
    showSuccess,
    showMessage,
    UserContext,
}

export const axios = axiosInstance