<template>
    <el-row :gutter="20">
        <el-col :span="14" style="text-align: center;">
            <el-image :src="LogoPng"/>
        </el-col>
        <el-col :span="10" style="text-align: center;">
            <el-form :model="signUpData" :rules="signUpRules" ref="signUpRef" label-position="top" style="width:300px">
                <el-form-item label="手机号:" prop="phone">
                    <el-input v-model="signUpData.phone" clearable/>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input v-model="signUpData.password" type="password" show-password clearable/>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="signUpData.name" clearable/>
                </el-form-item>
                <el-form-item label="公司名称:" prop="companyName">
                    <el-input v-model="signUpData.companyName" clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script setup>
import LogoPng from '../icons/favicon.png'
import {ref, onMounted, onBeforeMount, onUnmounted} from 'vue'
import {User} from '../models/user'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'

const router = useRouter()
const signUpData = ref({
    phone: '',
    password: '',
    name: '',
    companyName: ''
})
const signUpRef = ref()
const signUpRules = ref({
    phone: [{
        required: true, message: '', trigger: 'blur'
    }, {
        max: 11, min: 11, message: '请输入正确手机号', trigger: 'blur'
    }],
    name: [{
        required: true, message: '', trigger: 'blur'
    }, {
        max: 50, min: 1, message: '请输入姓名', trigger: 'blur'
    }],
    companyName: [{
        max: 200, message: '最多200个字', trigger: 'blur'
    }],
    password: [{
        required: true, message: '', trigger: 'blur'
    }, {
        max: 20, min: 6, message: '6-20个字符', trigger: 'blur'
    }]
})
function onSubmit() {
    signUpRef.value.validate((valid, fields) => {
        if(valid) {
            User.signUp(signUpData.value).then(res => {
                if(res?.code == 0) {
                    blogic.showMessage('注册成功')
                    router.push('/login')
                }else {
                    res?.showCodeDesc()
                }
            })
        }
    })
}
onBeforeMount(() => {
    document.querySelector('body').setAttribute('style', 'background-color: #ecf5ff')
})
onUnmounted(() => {
    document.querySelector('body').setAttribute('style', 'background-color: white')
})
</script>
<style scoped>
.el-row {
    margin-top: 10%
}
</style>