<script setup>
import { ref, onMounted } from "vue"
import * as blogic from '../blogic'

const activeName = ref('company')
const companyName = ref(blogic.loadContext().currentCompany.companyName)
const companyData = ref({
    requirementStat: {},
    iterationStat:{},
    taskStat:{},
    bugStat:{},
    tcStat:{}
})
const myData = ref({
    requirementStat: {},
    iterationStat:{},
    taskStat:{},
    bugStat:{},
    tcStat:{}
})
async function loadCompanyStatistic() {
    let companyId = blogic.getCurCompanyId()
    let res = await blogic.axios.get(`/Companies/${companyId}/Statistic`)
    if(res?.code == 0) {
        companyData.value = res.data
    }else {
        res?.showCodeDesc()
    }
}
async function loadMyStatistic() {
    let companyId = blogic.getCurCompanyId()
    let userId = blogic.getCurUser().userId
    let res = await blogic.axios.get(`/Companies/${companyId}/Users/${userId}/Statistic`)
    if(res?.code == 0) {
        myData.value = res.data
    }else {
        res?.showCodeDesc()
    }
}
function handleTabChange(name) {
    switch(name) {
        case 'company':
            loadCompanyStatistic()
            break;
        case 'my':
            loadMyStatistic()
            break;
    }
}
function reduce(obj) {
    let sum = 0
    if(obj) {
        let keys = Object.keys(obj)
        for(let index in keys) {
            if(obj[keys[index]]) {
                sum = sum + obj[keys[index]]
            }
        }
    }
    return sum
}
onMounted(() => {
    loadCompanyStatistic()
})
</script>
<template>
    <MainContainer>
        <el-tabs v-model="activeName" @tab-change="handleTabChange">
            <el-tab-pane :label="companyName" name="company">
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>产品</h2>
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="总数" :value="companyData.proTotal" />
                    </el-col>
                    <el-col :span="5">
                    </el-col>
                    <el-col :span="5">
                    </el-col>
                    <el-col :span="5">
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>需求</h2>
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="总数" :value="reduce(companyData.requirementStat)" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已确认" :value="companyData.requirementStat['10']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已规划" :value="companyData.requirementStat['20']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="开发中" :value="companyData.requirementStat['30']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已实现" :value="companyData.requirementStat['40']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已发布" :value="companyData.requirementStat['50']" />
                    </el-col>
                    <el-col :span="2">
                        <el-statistic title="已关闭" :value="companyData.requirementStat['60']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>迭代</h2>
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="总数" :value="reduce(companyData.iterationStat)" />
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="未开始" :value="companyData.iterationStat['10']" />
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="进行中" :value="companyData.iterationStat['20']" />
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="已完成" :value="companyData.iterationStat['30']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>任务</h2>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="总数" :value="reduce(companyData.taskStat)" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="未开始" :value="companyData.taskStat['10']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="进行中" :value="companyData.taskStat['20']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="暂停中" :value="companyData.taskStat['30']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已完成" :value="companyData.taskStat['90']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已取消" :value="companyData.taskStat['95']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>缺陷</h2>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="总数" :value="reduce(companyData.bugStat)" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="待确认" :value="companyData.bugStat['10']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已激活" :value="companyData.bugStat['20']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已确认" :value="companyData.bugStat['30']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已解决" :value="companyData.bugStat['40']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已关闭" :value="companyData.bugStat['50']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>用例</h2>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="总数" :value="reduce(companyData.tcStat)" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="未开始" :value="companyData.tcStat['10']" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="测试中" :value="companyData.tcStat['20']" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="被阻塞" :value="companyData.tcStat['30']" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="已完成" :value="companyData.tcStat['40']" />
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="我的" name="my">
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>产品</h2>
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="总数" :value="myData.proTotal" />
                    </el-col>
                    <el-col :span="5">
                    </el-col>
                    <el-col :span="5">
                    </el-col>
                    <el-col :span="5">
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>需求</h2>
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="总数" :value="reduce(myData.requirementStat)" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已确认" :value="myData.requirementStat['10']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已规划" :value="myData.requirementStat['20']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="开发中" :value="myData.requirementStat['30']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已实现" :value="myData.requirementStat['40']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已发布" :value="myData.requirementStat['50']" />
                    </el-col>
                    <el-col :span="2">
                        <el-statistic title="已关闭" :value="myData.requirementStat['60']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>迭代</h2>
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="总数" :value="reduce(myData.iterationStat)" />
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="未开始" :value="myData.iterationStat['10']" />
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="进行中" :value="myData.iterationStat['20']" />
                    </el-col>
                    <el-col :span="5">
                        <el-statistic title="已完成" :value="myData.iterationStat['30']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>任务</h2>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="总数" :value="reduce(myData.taskStat)" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="未开始" :value="myData.taskStat['10']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="进行中" :value="myData.taskStat['20']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="暂停中" :value="myData.taskStat['30']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已完成" :value="myData.taskStat['90']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已取消" :value="myData.taskStat['95']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>缺陷</h2>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="总数" :value="reduce(myData.bugStat)" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="待确认" :value="myData.bugStat['10']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已激活" :value="myData.bugStat['20']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已确认" :value="myData.bugStat['30']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已解决" :value="myData.bugStat['40']" />
                    </el-col>
                    <el-col :span="3">
                        <el-statistic title="已关闭" :value="myData.bugStat['50']" />
                    </el-col>
                </el-row>
                <el-divider/>
                <el-row align="middle" justify="center" style="text-align: center">
                    <el-col :span="4">
                        <h2>用例</h2>
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="总数" :value="reduce(myData.tcStat)" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="未开始" :value="myData.tcStat['10']" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="测试中" :value="myData.tcStat['20']" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="被阻塞" :value="myData.tcStat['30']" />
                    </el-col>
                    <el-col :span="4">
                        <el-statistic title="已完成" :value="myData.tcStat['40']" />
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </MainContainer>
</template>