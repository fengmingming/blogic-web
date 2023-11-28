<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()
</script>

<template>
  <MainContainer>
    <el-button @click="router.push('/login')">
      Home
    </el-button>
  </MainContainer>
</template>
