<script setup>
import {ref, onMounted} from 'vue'
import {Bug} from '../models/bug'
import * as blogic from '../blogic'

const bugs = ref([])
const total = ref(0)
const queryForm = ref({
    id:'',
    title:'',
    status:null,
    pageSize:10,
    pageNum:1
})

function handleSizeChange(pageSize) {
    queryForm.value.pageSize = pageSize
}

function handleCurrentChange(pageNum) {
    queryForm.value.pageNum = pageNum
}

async function loadBug() {
    let res = await Bug.findList(queryForm.value)
    if(res?.code == 0) {
        bugs.value = Bug.toBug(res.data.records)
        total.value = res.data.total
    }else {
        res?.showCodeDesc()
    }
}

onMounted(() => {
    loadBug()
})

const emptyBugForm = {
    id: null,
    iterationId:null,
    requirementId:null,
    testCaseId:null,
    title:null,
    iterationVersion:null,
    bugType:null,
    env:null,
    device:null,
    reproSteps:'',
    status:null,
    severity:null,
    priority:null,
    fixUserId:null,
    currentUserId:null
}

const bugForm = ref(emptyBugForm)
const dialog = ref(false)
const dialogKey = ref(0)
const requirementKey = ref(0)
const testCaseKey = ref(0)
function handleIterationChange() {
    requirementKey.value++
    testCaseKey.value++
}
function handleRequirementChange() {
    testCaseKey.value++
}

function showDialog() {
    dialogKey.value++
    dialog.value = true
}

function hideDialog() {
    dialog.value = false
}

function handleAddClick() {
    bugForm.value = {... emptyBugForm}
    showDialog()
}

async function handleEditClick(bug) {
    console.log(bug)
    let res = await Bug.findOne(bug.id)
    if(res?.code == 0) {
        bugForm.value = Bug.toBug([res.data])[0]
        showDialog()
    }else {
        res?.showCodeDesc()
    }
}

async function bugSubmitClick(submit) {
    if(submit) {
        let res = await Bug.save(bugForm.value)
        if(res?.code == 0) {
            blogic.showMessage('操作成功')
            hideDialog()
            loadBug()
        }else {
            res?.showCodeDesc()
        }
    }
}

</script>
<template>
    <div style="padding-top: 20px">
        <el-row>
            <el-col :span="20">
                <el-form :inline="true" v-model="queryForm">
                    <el-form-item label="ID">
                        <el-input v-model="queryForm.id"/>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="queryForm.title"/>
                    </el-form-item>
                    <el-form-item label="状态">
                        <DictSelect v-model="queryForm.status" dictType="bug_status"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadBug">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4" style="text-align: right">
                <el-button type="primary" @click="handleAddClick">新建缺陷</el-button>
            </el-col>
        </el-row>
    </div>
    <el-table :data="bugs" border style="width:100%">
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="severity" label="级别"/>
        <el-table-column prop="priority" label="优先级"/>
        <el-table-column prop="title" label="Bug标题"/>
        <el-table-column prop="status" label="状态"/>
        <el-table-column prop="createUserName" label="创建人"/>
        <el-table-column prop="currentUserName" label="指派给"/>
        <el-table-column prop="fixUserName" label="解决"/>
        <el-table-column prop="fixSolution" label="方案"/>
        <el-table-column label="操作">
            <template #="rowData">
                <el-button @click="handleEditClick(rowData.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="padding-top: 10px">
        <el-pagination
            v-model:current-page="queryForm.pageNum"
            v-model:page-size="queryForm.pageSize"
            :page-sizes="[10, 50, 100, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialog" :key="dialogKey" width="55%">
        <el-form v-model="bugForm" label-width="100px">
            <el-form-item label="关联迭代">
                <IterationSelect v-model="bugForm.iterationId" @change="handleIterationChange"/>
            </el-form-item>
            <el-form-item label="关联需求">
                <RequirementSelect v-model="bugForm.requirementId" :iterationId="bugForm.iterationId" :key="requirementKey" @change="handleRequirementChange"/>
            </el-form-item>
            <el-form-item label="关联用例">
                <TestCaseSelect v-model="bugForm.testCaseId" :iterationId="bugForm.iterationId" :requirementId="bugForm.requirementId" :key="testCaseKey"/>
            </el-form-item>
            <el-form-item label="版本号">
                <el-input v-model="bugForm.iterationVersion"/>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="bugForm.title"/>
            </el-form-item>
            <el-form-item label="bug类型">
                <DictSelect v-model="bugForm.bugType" dictType="bug_type"/>
            </el-form-item>
            <el-form-item label="环境">
                <DictSelect v-model="bugForm.env" dictType="bug_env"/>
            </el-form-item>
            <el-form-item label="设备">
                <el-input v-model="bugForm.device" />
            </el-form-item>
            <el-form-item label="重现步骤">
                <RichEditor v-model="bugForm.reproSteps" />
            </el-form-item>
            <el-form-item label="状态">
                <DictSelect v-model="bugForm.status" dictType="bug_status"/>
            </el-form-item>
            <el-form-item label="严重程度">
                <DictSelect v-model="bugForm.severity" dictType="bug_severity"/>
            </el-form-item>
            <el-form-item label="优先级">
                <DictSelect v-model="bugForm.priority" dictType="bug_priority"/>
            </el-form-item>
            <el-form-item label="指派给">
                <UserSelect :multiple="false" v-model="bugForm.currentUserId"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="bugSubmitClick(false)">关闭</el-button>
            <el-button type="primary" @click="bugSubmitClick(true)">保存</el-button>
        </template>
    </el-dialog>
</template>