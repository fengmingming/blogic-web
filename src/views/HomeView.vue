<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'
const router = useRouter()
const context = blogic.loadContext()
const content = ref('helloworld')
</script>
<template>
  <MainContainer>
    <template #header>
      <CompanyProductSelection/>
    </template>
    <el-button>
      Home
    </el-button>
    <RichKindEditor />
  </MainContainer>
</template>
