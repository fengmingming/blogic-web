<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import ModelPng from '../icons/model.png'
import RequirementPng from '../icons/requirement.png'
import IterationsPng from '../icons/iterations.png'
import BugPng from '../icons/bug.png'
import TaskPng from '../icons/task.png'
import StatisticsPng from '../icons/statistics.png'
import UserPng from '../icons/user.png'
import ProductPng from '../icons/product.png'
import MemberPng from '../icons/users.png'
import SelfPng from '../icons/self.png'
import * as blogic from '../blogic'
import {Setting} from '@element-plus/icons-vue'
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
const B = blogic
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
                <el-menu-item index="1" @click="routerPush('/home')">
                    <el-image :src="SelfPng"/>
                    <template #title>我的</template>
                </el-menu-item>
                <el-menu-item index="2" @click="routerPush('/member')" v-if="B.hasRole('ROLE_MANAGER')">
                    <el-image :src="MemberPng"/>
                    <template #title>人员</template>
                </el-menu-item>
                <el-menu-item index="3" @click="routerPush('/product')" v-if="B.existDefProductId() || B.hasRole('ROLE_MANAGER', 'ROLE_PM')">
                    <el-image :src="ProductPng"/>
                    <template #title>项目</template>
                </el-menu-item>
                <el-menu-item index="4" @click="routerPush('/models')" v-if="B.existDefProductId()">
                    <el-image :src="ModelPng"/>
                    <template #title>模型</template>
                </el-menu-item>
                <el-menu-item index="5" @click="routerPush('/requirement')" v-if="B.existDefProductId()">
                    <el-image :src="RequirementPng"/>
                    <template #title>需求</template>
                </el-menu-item>
                <el-menu-item index="6" @click="routerPush('/iteration')" v-if="B.existDefProductId()">
                    <el-image :src="IterationsPng"/>
                    <template #title>迭代</template>
                </el-menu-item>
                <el-menu-item index="7" @click="routerPush('/task')" v-if="B.existDefProductId()">
                    <el-image :src="TaskPng"/>
                    <template #title>任务</template>
                </el-menu-item>
                <el-menu-item index="8" @click="routerPush('/defect')" v-if="B.existDefProductId()">
                    <el-image :src="BugPng"/>
                    <template #title>缺陷</template>
                </el-menu-item>
                <el-menu-item index="9" @click="routerPush('/statistics')">
                    <el-image :src="StatisticsPng"/>
                    <template #title>统计</template>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="b_header">
                <el-row align="middle">
                    <el-col :span="23">
                        <slot name="header"></slot>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <el-dropdown trigger="click">
                            <span class="setting">
                                <el-icon :size="18"><Setting /></el-icon>
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
.b_aside .el-menu {
    border: 0px;
    margin-top: 50px;
}
.b_aside .el-menu-item {
    background-color: #ecf5ff;
}
.b_header {
    background-color: #ecf5ff;
    height: auto;
    padding: 5px;
}
.b_header .setting {
    margin-right: 30px;
}
</style>