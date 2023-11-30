<script setup>
import {onMounted, ref, defineProps} from 'vue'
import {useRouter} from 'vue-router'
import ModelPng from '../icons/model.png'
import RequirementPng from '../icons/requirement.png'
import IterationsPng from '../icons/iterations.png'
import BugPng from '../icons/bug.png'
import TaskPng from '../icons/task.png'
import StatisticsPng from '../icons/statistics.png'
import UserPng from '../icons/user.png'
import ProductPng from '../icons/product.png'
import * as blogic from '../blogic'
const props = defineProps({
    disableClick:{
        type: Boolean,
        default: false
    },
    disableClickMessage:{
        type: String,
        default: null
    }
})
const userIcon = ref()
const router = useRouter()
function routerPush(path) {
    if(props.disableClick) {
        if(props.disableClickMessage) {
            blogic.showWarn(props.disableClickMessage)
        }
    }else {
        router.push(path)
    }
}
function logout() {
    blogic.logout()
}
onMounted(() => {
    userIcon.value = UserPng
})
if(!blogic.isLogin()) {
    blogic.toLoginView()
}
</script>
<template>
    <el-container>
        <el-aside class="b_aside">
            <el-avatar shape="square" :size="35" :src="userIcon" @click="routerPush('/company')"/>
            <el-menu :collapse="true">
                <el-menu-item index="1" @click="routerPush('/product')">
                    <el-image :src="ProductPng"/>
                    <template #title>项目</template>
                </el-menu-item>
                <el-menu-item index="1" @click="routerPush('/model')">
                    <el-image :src="ModelPng"/>
                    <template #title>模型</template>
                </el-menu-item>
                <el-menu-item index="2" @click="routerPush('/requirement')">
                    <el-image :src="RequirementPng"/>
                    <template #title>需求</template>
                </el-menu-item>
                <el-menu-item index="3" @click="routerPush('/iteration')">
                    <el-image :src="IterationsPng"/>
                    <template #title>迭代</template>
                </el-menu-item>
                <el-menu-item index="4" @click="routerPush('/task')">
                    <el-image :src="TaskPng"/>
                    <template #title>任务</template>
                </el-menu-item>
                <el-menu-item index="5" @click="routerPush('/bug')">
                    <el-image :src="BugPng"/>
                    <template #title>缺陷</template>
                </el-menu-item>
                <el-menu-item index="6" @click="routerPush('/statistics')">
                    <el-image :src="StatisticsPng"/>
                    <template #title>统计</template>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="b_header">
                <el-row>
                    <el-col :span="23" style="padding-top: 5px">
                        <slot name="header"></slot>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <el-dropdown trigger="click">
                            <span class="setting">
                                <el-icon :size="20">
                                    <svg viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"></path></svg>
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-header>
            <el-main class="b_main">
                <slot></slot>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
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
.b_aside .el-avatar {
    background-color: #ecf5ff;
}
.b_aside .el-menu {
    margin-top: 50px;
}
.b_aside .el-menu-item {
    background-color: #ecf5ff;
}
.b_header {
    background-color: #ecf5ff;
    height: auto;
    padding: 10px;
}
.b_header .setting {
    margin-right: 30px;
}
</style>