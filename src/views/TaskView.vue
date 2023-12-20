<script setup>
import {ref, onMounted} from 'vue'
import {Task} from '../models/task'

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

function loadTasks() {

}
const emptyTask = {

}
const taskForm = ref(emptyTask)
function handleAddClick() {
    taskForm.value = emptyTask
    showDialog()
}
function handleEditClick(task) {

}
function showDialog() {
    dialogKey.value++
    dialog.value = true
}
function hideDialog() {
    dialog.value = false
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
            <el-form-item label="所属迭代">

            </el-form-item>
            <el-form-item label="关联需求">

            </el-form-item>
            <el-form-item label="任务状态">
                <DictSelect v-model="taskForm.status" dictType="task_status"/>
            </el-form-item>
            <el-form-item label="优先级">
                
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
            </el-form-item>
            <el-form-item label="任务描述">
                <RichEditor v-model:content="taskForm.taskDesc" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>