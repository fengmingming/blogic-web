<script setup>
import {ref, onMounted} from 'vue'
import {Bug} from '../models/bug'
import * as blogic from '../blogic'
import {useRouter} from 'vue-router'
import {Dict} from '../models/dict'

const router = useRouter()
const bugs = ref([])
const total = ref(0)
const queryForm = ref({
    id: '',
    iterationId: null,
    requirementId: null,
    testCaseId: null,
    title: '',
    status: null,
    bugType: null,
    env: null,
    currentUserId: null,
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
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('bug_status')))
    let fixSolutionDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('bug_fix_solution')))
    let res = await Bug.findList(queryForm.value)
    if(res?.code == 0) {
        let datas = Bug.toBug(res.data.records)
        datas.forEach(data => {
            data.fixSolutionName = fixSolutionDict[data.fixSolution]
            data.statusName = statusDict[data.status]
        })
        bugs.value = datas
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
const bugFormRef = ref()
const bugFormRules = ref({
    title: [{
        required: true, message: '', trigger: 'blur'
    }, {
        max: 200, message: '最多200字', trigger: 'blur'
    }],
    iterationVersion: [{
        max: 50, message: '最多50字', trigger: 'blur'
    }],
    bugType: [{
        required: true, message: '', trigger: 'blur'
    }],
    env: [{
        required: true, message: '', trigger: 'blur'
    }],
    device: [{
        max: 200, message: '最多200字', trigger: 'blur'
    }],
    reproSteps: [{
        required: true, message: '', trigger: 'blur'
    }],
    status: [{
        required: true, message: '', trigger: 'blur'
    }],
    severity: [{
        required: true, message: '', trigger: 'blur'
    }],
    priority: [{
        required: true, message: '', trigger: 'blur'
    }]
})

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
function handleViewClick(bug) {
    router.push(`/bug/${bug.id}`)
}
async function handleEditClick(bug) {
    let res = await Bug.findOne(bug.id)
    if(res?.code == 0) {
        bugForm.value = Bug.toBug([res.data])[0]
        showDialog()
    }else {
        res?.showCodeDesc()
    }
}
function bugSubmitClick(submit) {
    if(submit) {
        bugFormRef.value.validate((valid, fields) => {
            if(valid) {
                Bug.save(bugForm.value).then(res => {
                    if(res?.code == 0) {
                        blogic.showMessage('操作成功')
                        hideDialog()
                        loadBug()
                    }else {
                        res?.showCodeDesc()
                    }
                })
            }
        })
    }else {
        hideDialog()
    }
}

</script>
<template>
    <div style="padding-top: 20px">
        <el-row>
            <el-col :span="22">
                <el-form :inline="true" v-model="queryForm">
                    <el-form-item label="测试ID" style="width: 150px">
                        <el-input type="text" v-model="queryForm.id" :formatter="value => value.replace(/\D/g, '')" :parser="value => value.replace(/\D/g, '')"/>
                    </el-form-item>
                    <el-form-item label="迭代">
                        <IterationSelect v-model="queryForm.iterationId"/>
                    </el-form-item>
                    <el-form-item label="需求">
                        <RequirementSelect v-model="queryForm.requirementId"/>
                    </el-form-item>
                    <el-form-item label="用例">
                        <TestCaseSelect v-model="queryForm.testCaseId"/>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="queryForm.title"/>
                    </el-form-item>
                    <el-form-item label="状态" style="width: 200px">
                        <DictSelect v-model="queryForm.status" dictType="bug_status"/>
                    </el-form-item>
                    <el-form-item label="bug类型" style="width: 200px">
                        <DictSelect v-model="queryForm.bugType" dictType="bug_type"/>
                    </el-form-item>
                    <el-form-item label="环境" style="width: 200px">
                        <DictSelect v-model="queryForm.env" dictType="bug_env"/>
                    </el-form-item>
                    <el-form-item label="指派给">
                        <UserSelect v-model="queryForm.currentUserId" :multiple="false"/>
                    </el-form-item>
                    <el-form-item label="解决者">
                        <UserSelect v-model="queryForm.fixUserId" :multiple="false"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadBug">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="2" style="text-align: right">
                <el-button type="primary" @click="handleAddClick">新建缺陷</el-button>
            </el-col>
        </el-row>
    </div>
    <el-table :data="bugs" border style="width:100%">
        <el-table-column prop="id" label="ID" width="100px"/>
        <el-table-column prop="severity" label="级别" width="50px"/>
        <el-table-column prop="priority" label="优先级" width="50px"/>
        <el-table-column prop="title" label="Bug标题"/>
        <el-table-column prop="statusName" label="状态" width="100px"/>
        <el-table-column prop="currentUserName" label="指派给" width="150px"/>
        <el-table-column prop="fixUserName" label="解决人" width="150px"/>
        <el-table-column prop="fixSolutionName" label="解决方案" width="150px"/>
        <el-table-column prop="createUserName" label="创建人" width="150px"/>
        <el-table-column prop="createTime" label="创建时间" width="200px"/>
        <el-table-column label="操作" fixed="right" width="200px">
            <template #="rowData">
                <el-button @click="handleViewClick(rowData.row)" text>查看</el-button>
                <el-button @click="handleEditClick(rowData.row)" text>编辑</el-button>
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
        <el-form :model="bugForm" label-width="100px" :rules="bugFormRules" ref="bugFormRef">
            <el-form-item label="关联迭代" prop="iterationId">
                <IterationSelect v-model="bugForm.iterationId" @change="handleIterationChange"/>
            </el-form-item>
            <el-form-item label="关联需求">
                <RequirementSelect v-model="bugForm.requirementId" :iterationId="bugForm.iterationId" :key="requirementKey" @change="handleRequirementChange"/>
            </el-form-item>
            <el-form-item label="关联用例">
                <TestCaseSelect v-model="bugForm.testCaseId" :iterationId="bugForm.iterationId" :requirementId="bugForm.requirementId" :key="testCaseKey"/>
            </el-form-item>
            <el-form-item label="版本号" prop="iterationVersion">
                <el-input v-model="bugForm.iterationVersion"/>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="bugForm.title"/>
            </el-form-item>
            <el-form-item label="bug类型" prop="bugType">
                <DictSelect v-model="bugForm.bugType" dictType="bug_type"/>
            </el-form-item>
            <el-form-item label="环境" prop="env">
                <DictSelect v-model="bugForm.env" dictType="bug_env"/>
            </el-form-item>
            <el-form-item label="设备" prop="device">
                <el-input v-model="bugForm.device" />
            </el-form-item>
            <el-form-item label="重现步骤" prop="reproSteps">
                <RichEditor v-model="bugForm.reproSteps" />
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="bugForm.id">
                <DictSelect v-model="bugForm.status" dictType="bug_status"/>
            </el-form-item>
            <el-form-item label="严重程度" prop="severity">
                <DictSelect v-model="bugForm.severity" dictType="bug_severity"/>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
                <DictSelect v-model="bugForm.priority" dictType="bug_priority"/>
            </el-form-item>
            <el-form-item label="指派给" prop="currentUserId">
                <UserSelect :multiple="false" v-model="bugForm.currentUserId"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="bugSubmitClick(false)">关闭</el-button>
            <el-button type="primary" @click="bugSubmitClick(true)">保存</el-button>
        </template>
    </el-dialog>
</template>