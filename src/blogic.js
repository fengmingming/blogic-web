import router from './router'
import _axios from 'axios'
import {ElMessage, ElNotification} from 'element-plus'
import {v4 as uuid} from 'uuid'

class UserContext {
    constructor() {
        this.token = '',
        this.user = {
            userId: null,
            userName: null,
            phone: null
        },
        this.companies = []
        this.currentCompany = null
        this.currentProduct = null
    }
}

function loadContext() {
    if(localStorage.key('context')) {
        return JSON.parse(localStorage.getItem('context'))
    }
    return new UserContext();
}

function storeContext(context) {
    console.log('storeContext', context)
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

function showNotification(title, message) {
    ElNotification({
        title: title,
        message: message,
    })
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
    config.headers['Request-ID'] = uuid()
    return config
}, function (error) {
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function(res) {
    console.log('axios response', res)
    if(res.status === 200) {
        res.data.showCodeDesc = function() {
            if(res.data.code > 0) {
                showError(res.data.codeDesc);
            }
        }
        if(res.data.code === 401) {
            showWarn('请重新登录')
            toLoginView()
            return null;
        }
        return res.data;
    }else {
        showError('请求异常' + res.statusText)
        return null;
    }
}, function (error) {
    console.log('axios', error)
    showError('请求异常')
    return Promise.reject(error)
})

function handleResponse(res) {
    if(res?.code === 0) {
        return res.data
    }
    res?.showCodeDesc()
    throw res?res.codeDesc:InterruptOperation
}

function extractData(res, f) {
    if(res?.code === 0) {
        f(res.data)
    }else{
        res?.showCodeDesc()
    }
}

function objToQuery(obj) {
    if(!obj) return ''
    return Object.keys(obj).map((key) => {
        if(obj[key]) {
            return key + '=' + obj[key]
        }else {
            return key + '='
        }
    }).join('&')
}

function getCurCompanyId() {
    let context = loadContext()
    if(!context.currentCompany) {
        throw '未选择公司'
    }
    return context.currentCompany.companyId
}

function existDefProductId() {
    let context = loadContext()
    return context.currentProduct?.productId 
}

function getCurProductId() {
    let context = loadContext()
    if(!context.currentProduct) {
        throw '未选择公司'
    }
    return context.currentProduct.productId
}

function getCurUser() {
    let context = loadContext()
    return context.user
}

function hasRoles(...roles) {
    let context = loadContext()
    let existRoles = context.currentCompany.roles
    return (roles.filter(it => existRoles.includes(it)).length === roles.length)
}

function hasRole(...roles) {
    let context = loadContext()
    let existRoles = context.currentCompany.roles
    return (roles.filter(it => existRoles.includes(it)).length > 0)
}

function verifyUserPermission(userId) {
    return hasRole('ROLE_MANAGER') || (loadContext().user.userId === userId)
}

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
    showNotification,
    handleResponse,
    extractData,
    objToQuery,
    getCurCompanyId,
    existDefProductId,
    getCurProductId,
    hasRoles,
    hasRole,
    verifyUserPermission,
    getCurUser,
}

export const axios = axiosInstance
export const InterruptOperation = 'Interrupt Operation'