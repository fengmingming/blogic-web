<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'

const loginData = ref({
    phone: '',
    password: ''
})
const router = useRouter()
function onSubmit() {
    blogic.login({
        phone: loginData.value.phone,
        password: loginData.value.password,
        terminal: 'PC',
    }).then(res => {
        if(res) {
            if(res.code == 0) {
                let context = blogic.loadContext()
                context.token = res.data.token
                blogic.storeContext(context)
                blogic.axios.get('/Users/' + res.data.userId).then(res => {
                    if(res) {
                        if(res.code == 0) {
                            context.user.userId = res.data.userId
                            context.user.userName = res.data.userName
                            context.user.phone = res.data.phone
                            res.data.companies.forEach(company => {
                                context.companies.push({
                                    companyId: company.companyId,
                                    companyName: company.companyName,
                                    admin: company.admin,
                                    roles: company.roles
                                })
                            })
                            blogic.storeContext(context)
                            router.push('/')
                            return;
                        }else {
                            res.showCodeDesc()
                        }
                    }
                    blogic.storeContext(new blogic.UserContext())
                }).catch(error => {
                    blogic.storeContext(new blogic.UserContext())
                })
            }else {
                res.showCodeDesc()
            }
        }
    });
}
</script>
<template>
    <el-row :gutter="20">
        <el-col :span="8"></el-col>
        <el-col :span="4" :offset="6">
            <el-form :model="loginData" label-position="top">
                <el-form-item label="手机号">
                    <el-input v-model="loginData.phone" :minLength="11" :maxLength="11"/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="loginData.password" type="password"/>
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