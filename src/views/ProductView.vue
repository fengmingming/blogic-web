<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

</script>
<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection />
        </template>
        <template #default>
            <el-button>项目</el-button>
        </template>
    </MainContainer>
</template>