<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'

const loginData = ref({
    phone: '13788888998',
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
            userRes.data.companies.forEach(company => {
                context.companies.push({
                    companyId: company.companyId,
                    companyName: company.companyName,
                    admin: company.admin,
                    roles: company.roles
                })
            })
            blogic.storeContext(context)
            if(context.companies.length === 1) {
                let company = context.companies[0]
                let switchContextRes = await blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId: company.companyId})
                if(switchContextRes?.code === 0) {
                    context.currentCompany = company
                    blogic.storeContext(context)
                }else {
                    switchContextRes?.showCodeDesc()
                }
                router.push('/home')
            }else {
                router.push('/company')
            }
            return;
        }else {
            res?.showCodeDesc()
        }
        blogic.storeContext(new blogic.UserContext())
    }else {
        res?.showCodeDesc()
    }
}
</script>
<template>
    <el-row :gutter="20">
        <el-col :span="8"></el-col>
        <el-col :span="4" :offset="6">
            <el-form :model="loginData" label-position="top">
                <el-form-item label="手机号">
                    <el-input v-model="loginData.phone" :minLength="11" :maxLength="11" clearable/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="loginData.password" type="password" show-password clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<style scoped>
.el-row {
    margin-top: 10%
}
</style>