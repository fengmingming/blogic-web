<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

</script>
<template>
    <MainContainer>
        <template #header>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item></el-breadcrumb-item>
                <el-breadcrumb-item>promotion management</el-breadcrumb-item>
                <el-breadcrumb-item>promotion list</el-breadcrumb-item>
                <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <el-button>项目</el-button>
    </MainContainer>
</template>