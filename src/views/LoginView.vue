<script setup>
import {reactive,ref} from 'vue'
import {useRouter} from 'vue-router'
const loginData = ref({
    name: '',
    password: ''
})
const router = useRouter()
function onSubmit() {
    router.push('/')
}
</script>
<template>
    <el-row :gutter="20">
        <el-col :span="8"></el-col>
        <el-col :span="4" :offset="6">
            <el-form :model="loginData" label-position="top">
                <el-form-item label="用户名">
                    <el-input v-model="loginData.name" />
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