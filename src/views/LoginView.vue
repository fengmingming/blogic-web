<script setup>
import {ref, onBeforeMount, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'
import LogoPng from '../icons/favicon.png'
import {Product} from '../models/product'

const loginData = ref({
    phone: '16610001001',
    password: '123456'
})
const router = useRouter()
async function onSubmit() {
    let phone = loginData.value.phone.trim()
    let password = loginData.value.password.trim()
    if(phone.length != 11) {
        blogic.showWarn('请输入正确手机号')
        return
    }
    if(!password) {
        blogic.showWarn('请输入密码')
        return
    }
    let res = await blogic.login({
        phone,
        password,
        terminal: 'PC',
    });
    if(res?.code === 0) {
        let context = blogic.loadContext()
        context.token = res.data.token
        blogic.storeContext(context)
        let userRes = await blogic.axios.get('/Users/' + res.data.userId);
        if(userRes?.code === 0) {
            context.user.userId = userRes.data.userId
            context.user.userName = userRes.data.userName
            context.user.phone = userRes.data.phone
            context.companies = []
            userRes.data.companies.forEach(company => {
                context.companies.push({
                    companyId: company.companyId,
                    companyName: company.companyName,
                    admin: company.admin,
                    roles: company.roles
                })
            })
            blogic.storeContext(context)
            let company = userRes.data.companies.filter(it => it.def)[0]
            let switchContextRes = await blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId: company.companyId})
            if(switchContextRes?.code === 0) {
                context.currentCompany = company
                blogic.storeContext(context)
                let proRes = await Product.findByCompanyId(context.currentCompany.companyId)
                if(proRes?.code == 0) {
                    let pros = proRes.data.records
                    if(pros) {
                        let pro;
                        if(switchContextRes.data.defProductId) {
                            pro = pros.filter(it => it.id === switchContextRes.data.defProductId)[0]
                        }
                        if(!pro) {
                            pro = pros[0]
                        }
                        if(pro) {
                            context.currentProduct = {productId: pro.id, productName: pro.productName}
                            blogic.storeContext(context)
                        }
                    }
                }else {
                    proRes?.showCodeDesc()
                }
            }else {
                switchContextRes?.showCodeDesc()
            }
            router.push('/home')
        }else {
            userRes?.showCodeDesc()
            blogic.storeContext(new blogic.UserContext())
        }
    }else {
        res?.showCodeDesc()
    }
}
onBeforeMount(() => {
    document.querySelector('body').setAttribute('style', 'background-color: #ecf5ff')
})
onUnmounted(() => {
    document.querySelector('body').setAttribute('style', 'background-color: white')
})
</script>
<template>
    <el-row :gutter="20" style="margin-top: 10%">
        <el-col :span="14" style="text-align: center;">
            <el-image :src="LogoPng"/>
        </el-col>
        <el-col :span="10" style="text-align: center;">
            <el-form :model="loginData" label-position="top" style="width:300px">
                <el-form-item label="手机号">
                    <el-input v-model="loginData.phone" :minLength="11" :maxLength="11" clearable/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="loginData.password" type="password" show-password clearable/>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="onSubmit" style="width:100%">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-row style="width: 100%">
                        <el-col :span="12" style="text-align: left">
                            <el-link type="primary">忘记密码</el-link>
                        </el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-link type="primary" href="/signup">立即注册</el-link>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

