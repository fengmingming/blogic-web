<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()
</script>

<template>
  <MainContainer>
    <el-button @click="router.push('/login')">
      登录
    </el-button>
  </MainContainer>
</template>
