<script setup>
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'
const router = useRouter()
const context = blogic.loadContext()
if(!context.token) {
  router.push('/login')
}else {

}
</script>
<template>
  <MainContainer>
    <el-button>
      Home
    </el-button>
  </MainContainer>
</template>
