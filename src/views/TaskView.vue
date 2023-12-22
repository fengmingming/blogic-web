<script setup>
import {ref, onMounted} from 'vue'
import {Task} from '../models/task'
import {Dict} from '../models/dict'
import * as blogic from '../blogic'

const tasks = ref([])
const dialog = ref(false)
const dialogKey = ref(0)
const queryForm = ref({
    pageSize:10,
    pageNum:1,
    iterationName:'',
    taskName:'',
    status:null
})
const total = ref(0)
const taskStatusDict = ref([])
function handleSizeChange(pageSize) {
    queryForm.value.pageSize = pageSize
    loadTasks()
}
function handleCurrentChange(pageNum) {
    queryForm.value.pageNum = pageNum
    loadTasks()
}
function loadTasks() {
    Task.findList(queryForm.value).then(res => {
        if(res?.code == 0) {
            total.value = res.data.total
            let objs = Task.toTask(res.data.records)
            objs.forEach(obj => {
                obj.status = taskStatusDict.value[obj.status]
            })
            tasks.value = objs
        }else {
            res?.showCodeDesc()
        }
    })
}
onMounted(() => {
    Dict.findByDictType('task_status').then(res => {
        if(res?.code == 0) {
            taskStatusDict.value = Dict.toMap(res.data)
            loadTasks()
        }else {
            res?.showCodeDesc()
        }
    })
})
const emptyTask = {
    id:null,
    taskName: '',
    iterationId: null,
    requirementId: null,
    status: null,
    priority: null,
    overallTime: 0,
    consumeTime: 0,
    currentUserId: null,
    taskDesc: ''
}
const taskForm = ref(emptyTask)
function handleAddClick() {
    taskForm.value = emptyTask
    showDialog()
}
function handleEditClick(task) {
    Task.findOne(task.id).then(res => {
        if(res?.code == 0) {
            let {id, taskName, iterationId, requirementId, status, priority, overallTime, consumeTime, currentUserId, taskDesc} = {... res.data}
            taskForm.value = {id, taskName, iterationId, requirementId, status, priority, overallTime, consumeTime, currentUserId, taskDesc}
            showDialog()
        }else {
            res?.showCodeDesc()
        }
    })
}
function showDialog() {
    dialogKey.value++
    dialog.value = true
}
function hideDialog() {
    dialog.value = false
}
const iterationKey = ref(0)
function handleIterationChange(iterationId) {
    iterationKey.value++ 
}
function taskSubmitClick(submit) {
    if(submit) {
        Task.save(taskForm.value).then(res => {
            if(res?.code == 0) {
                blogic.showMessage('操作成功')
                loadTasks()
            }else {
                res?.showCodeDesc()
            }
        })
    }
    hideDialog()
}
</script>
<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection />
        </template>
        <template #default>
            <el-row>
                <el-col :span="20">
                    <el-form :inline="true" v-model="queryForm">
                        <el-form-item label="迭代名称">
                            <el-input v-model="queryForm.iterationName"/>
                        </el-form-item>
                        <el-form-item label="任务名称">
                            <el-input v-model="queryForm.taskName"/>
                        </el-form-item>
                        <el-form-item label="状态">
                            <DictSelect v-model="queryForm.status" dictType="task_status"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loadTasks">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4" style="text-align: right;">
                    <el-button type="primary" @click="handleAddClick">新建任务</el-button>
                </el-col>
            </el-row>
            <div style="padding-top: 20px">
                <el-table :data="tasks" border style="width: 100%">
                    <el-table-column prop="iterationName" label="迭代名称"/>
                    <el-table-column prop="taskName" label="任务名称"/>
                    <el-table-column prop="currentUserName" label="指派给"/>
                    <el-table-column prop="completeUserName" label="由谁完成"/>
                    <el-table-column prop="status" label="状态"/>
                    <el-table-column prop="createUserName" label="创建人"/>
                    <el-table-column label="操作">
                        <template #="rowData">
                            <el-button @click="handleEditClick(rowData.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="padding: 10px 10px;">
                    <el-pagination
                        v-model:current-page="queryForm.pageNum"
                        v-model:page-size="queryForm.pageSize"
                        :page-sizes="[10, 50, 100, 500]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        />
                </div>
            </div>
        </template>
    </MainContainer>
    <el-dialog v-model="dialog" :key="dialogKey" width="55%">
        <el-form v-model="taskForm" label-width="100px">
            <el-form-item label="任务名称">
                <el-input v-model="taskForm.taskName"/>
            </el-form-item>
            <el-form-item label="所属迭代" >
                <IterationSelect v-model="taskForm.iterationId" @change="handleIterationChange"/>
            </el-form-item>
            <el-form-item label="关联需求" >
                <RequirementSelect v-model="taskForm.requirementId" :iterationId="taskForm.iterationId" :key="iterationKey"/>
            </el-form-item>
            <el-form-item label="任务状态">
                <DictSelect v-model="taskForm.status" dictType="task_status"/>
            </el-form-item>
            <el-form-item label="优先级">
                <DictSelect v-model="taskForm.priority" dictType="task_priority"/>
            </el-form-item>
            <el-form-item label="进度">
                <el-col :span="2" style="text-align:right;padding-right: 15px;">
                    <span>预计</span>
                </el-col>
                <el-col :span="3">
                    <el-input-number v-model="taskForm.overallTime" :min="0"/>
                </el-col>
                <el-col :span="4"></el-col>
                <el-col :span="2" style="text-align:right;padding-right: 15px;">
                    <span>消耗</span>
                </el-col>
                <el-col :span="3">
                    <el-input-number v-model="taskForm.consumeTime" :min="0"/>
                </el-col>
                <el-col :span="10"/>
            </el-form-item>
            <el-form-item label="指派给">
                <UserSelect :multiple="false" v-model="taskForm.currentUserId" :iterationId="taskForm.iterationId" :productId="taskForm.productId" />
            </el-form-item>
            <el-form-item label="任务描述">
                <RichEditor v-model:content="taskForm.taskDesc" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="taskSubmitClick(false)">关闭</el-button>
            <el-button type="primary" @click="taskSubmitClick(true)">保存</el-button>
        </template>
    </el-dialog>
</template>