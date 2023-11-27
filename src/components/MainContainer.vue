<script setup>
import {onMounted, ref, getCurrentInstance} from 'vue'
import {Menu as IconMenu,TrendCharts,Document} from '@element-plus/icons-vue'

const global = getCurrentInstance().appContext.config.globalProperties;
const userIcon = ref()
onMounted(() => {
    userIcon.value = global.loadContext()?.userIcon
})

</script>
<template>
    <el-container>
        <el-aside class="b_aside">
            <el-avatar shape="square" :size="50" :src="userIcon" />
            <el-menu :collapse="true">
                <el-menu-item index="1">
                    <el-icon><IconMenu /></el-icon>
                    <template #title>模型</template>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon><Document /></el-icon>
                    <template #title>需求</template>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon><IconMenu /></el-icon>
                    <template #title>任务</template>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon><IconMenu /></el-icon>
                    <template #title>缺陷</template>
                </el-menu-item>
                <el-menu-item index="5">
                    <el-icon><TrendCharts /></el-icon>
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
.b_header {
    background-color: #ecf5ff;
}
.b_aside .el-menu-item{
    background-color: #ecf5ff;
}
</style>