<script setup>
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'
const router = useRouter()
const context = blogic.loadContext()
</script>
<template>
  <MainContainer>
    <template #header>
      <CompanyProductSelection/>
    </template>
    <el-button>
      Home
    </el-button>
  </MainContainer>
</template>
