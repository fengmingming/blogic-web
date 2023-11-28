<script setup>
import {onMounted, ref, getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
import ModelPng from '../icons/model.png'
import RequirementPng from '../icons/requirement.png'
import IterationsPng from '../icons/iterations.png'
import BugPng from '../icons/bug.png'
import TaskPng from '../icons/task.png'
import StatisticsPng from '../icons/statistics.png'

const global = getCurrentInstance().appContext.config.globalProperties;
const userIcon = ref()
const router = useRouter()
onMounted(() => {
    userIcon.value = global.loadContext()?.userIcon
})
function routerPush(path) {
    router.push(path)
}

</script>
<template>
    <el-container>
        <el-aside class="b_aside">
            <el-avatar shape="square" :size="50" :src="userIcon" />
            <el-menu :collapse="true">
                <el-menu-item index="1" @click="routerPush('')">
                    <el-image :src="ModelPng"/>
                    <template #title>模型</template>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-image :src="RequirementPng"/>
                    <template #title>需求</template>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-image :src="IterationsPng"/>
                    <template #title>迭代</template>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-image :src="TaskPng"/>
                    <template #title>任务</template>
                </el-menu-item>
                <el-menu-item index="5">
                    <el-image :src="BugPng"/>
                    <template #title>缺陷</template>
                </el-menu-item>
                <el-menu-item index="6">
                    <el-image :src="StatisticsPng"/>
                    <template #title>统计</template>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="b_header">Header</el-header>
            <el-main class="b_main">
                <slot></slot>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-container,.el-header,.el-main{
    border: 1px solid var(--el-border-color);
    border-radius: 0;
}
.b_aside {
    padding: 10px 0px;
    width: auto;
    background-color: #ecf5ff;
    text-align: center;
}
.b_aside .el-image {
    width: 23px;
    height: 23px;
}
.b_header {
    background-color: #ecf5ff;
}
.b_aside .el-menu-item{
    background-color: #ecf5ff;
}
</style>