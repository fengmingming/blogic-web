<template>
<el-tabs @tab-change="handleTabChange" v-model="currentTab">
    <el-tab-pane label="任务" name="task">
        <el-table :data="tasks" border style="width: 100%">
            <el-table-column label="任务id" prop="id" width="150px"/>
            <el-table-column label="任务名称" prop="taskName"/>
            <el-table-column label="任务状态" prop="statusName" width="100px"/>
            <el-table-column label="创建人" prop="createUserName" width="200px"/>
            <el-table-column label="创建时间" prop="createTime" width="200px"/>
            <el-table-column #="rowData" label="操作" width="100px">
                <el-button type="primary" @click="router.push(`/task/${rowData.row.id}`)" text>查看</el-button>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="taskTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="缺陷" name="bug">
        <el-table :data="bugs" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100px"/>
            <el-table-column prop="severity" label="级别" width="50px"/>
            <el-table-column prop="priority" label="优先级" width="50px"/>
            <el-table-column prop="title" label="Bug标题"/>
            <el-table-column prop="statusName" label="状态" width="100px"/>
            <el-table-column prop="fixUserName" label="解决人" width="150px"/>
            <el-table-column prop="fixSolutionName" label="解决方案" width="150px"/>
            <el-table-column prop="createUserName" label="创建人" width="150px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #="rowData">
                    <el-button type="primary" @click="router.push(`/bug/${rowData.row.id}`)" text>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="bugTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="用例" name="testcase">
        <el-table :data="testcases" border style="width:100%">
            <el-table-column prop="title" label="用例标题"/>
            <el-table-column prop="priority" label="优先级" width="100px"/>
            <el-table-column prop="ownerUserName" label="负责人" width="150px"/>
            <el-table-column prop="smoke" label="是否冒烟" :formatter="(row, column, cellValue, index) => cellValue?'是':'否'" width="100px"/>
            <el-table-column prop="status" label="状态" width="100px"/>
            <el-table-column prop="createUserName" label="创建人" width="150px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #=rowData>
                    <el-button type="primary" @click="router.push(`/testCase/${rowData.row.id}`)" text>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="testcaseTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
</el-tabs>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'
import {Task} from '../models/task'
import {Bug} from '../models/Bug'
import {Dict} from '../models/Dict'
import {TestCase} from '../models/testcase'

const currentTab = ref('task')
const router = useRouter()
const userId = blogic.loadContext().user.userId
const pageSize = ref(10)
const pageNum = ref(1)
function handleSizeChange(size) {
  pageSize.value = size
  handleTabChange(currentTab.value)
}
function handleCurrentChange(num) {
  pageNum.value = num
  handleTabChange(currentTab.value)
}
//任务
const taskTotal = ref(0)
const tasks = ref([])
async function loadTask() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('task_status')))
    let res = await Task.findMyList({currentUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    if(res?.code == 0) {
        taskTotal.value = res.data.total
        let objs = Task.toTask(res.data.records)
        objs.forEach(obj => {
            obj.statusName = statusDict[obj.status]
        })
        tasks.value = objs
    }else {
        res?.showCodeDesc()
    }
}
//缺陷
const bugs = ref([])
const bugTotal = ref(0)
async function loadBug() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('bug_status')))
    let res = await Bug.findMyList({currentUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    if(res?.code == 0) {
        let datas = Bug.toBug(res.data.records)
        datas.forEach(data => {
            data.statusName = statusDict[data.status]
        })
        bugs.value = datas
        bugTotal.value = res.data.total
    }else {
        res?.showCodeDesc()
    }
}
//用例
const testcaseTotal = ref(0)
const testcases = ref([])
async function loadTestCase() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('testcase_status')))
    let res = await TestCase.findMyList({currentUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    if(res?.code == 0) {
        res.data.records.forEach(it => {
            it.status = statusDict[it.status]
        })
        testcaseTotal.value = res.data.total
        testcases.value = res.data.records
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    loadTask()
})
function handleTabChange(tabName) {
    switch (tabName) {
        case 'task':
            loadTask()
            break;
        case 'bug':
            loadBug()
            break;
        case 'testcase':
            loadTestCase()
            break;
    }
    currentTab.value = tabName
}
</script>