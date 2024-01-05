<script setup>
import {ref, onMounted} from 'vue'
import {TestCase} from '../models/testcase'
import {Dict} from '../models/dict'
import * as blogic from '../blogic'
import {useRouter} from 'vue-router'

const router = useRouter()
const queryForm = ref({
    iterationId: null,
    title: '',
    pageSize: 10,
    pageNum: 1
})
const testCases = ref([])
const total = ref(0)
const statusDict = ref({})
async function loadTestCase() {
    let res = await TestCase.findList(queryForm.value)
    if(res?.code == 0) {
        res.data.records.forEach(it => {
            it.status = statusDict.value[it.status]
        })
        total.value = res.data.total
        testCases.value = res.data.records
    }else {
        res?.showCodeDesc()
    }
}

function handleSizeChange(pageSize) {
    queryForm.value.pageSize = pageSize
}

function handleCurrentChange(pageNum) {
    queryForm.value.pageNum = pageNum
}

onMounted(() => {
    Dict.findByDictType('testcase_status').then(res => {
        if(res?.code == 0) {
            statusDict.value = Dict.toMap(res.data)
            loadTestCase()
        }else {
            res?.showCodeDesc()
        }
    })
})

const dialog = ref(false)
const dialogKey = ref(0)

function showDialog() {
    dialogKey.value++
    dialog.value = true
}

function hideDialog() {
    dialog.value = false
}

const emptyTestCase = {
    id:null,
    productId: blogic.getCurProductId(),
    iterationId:null,
    requirementId:null,
    title:'',
    priority:null,
    precondition:'',
    ownerUserId:null,
    smoke:null,
    status:null,
    completeTime:null,
    steps: null
}
const testCaseForm = ref(emptyTestCase)
function handleAddClick() {
    testCaseForm.value = {... emptyTestCase}
    showDialog()
}
function handleViewClick(testCase) {
    router.push(`/testCase/${testCase.id}`)
}
function handleEditClick(testCase) {
    TestCase.findOne(testCase.id).then(res => {
        if(res?.code == 0) {
            let {id, iterationId, requirementId, title, priority, precondition, steps, ownerUserId, smoke, status, completeTime} = {... res.data}
            testCaseForm.value = {id, iterationId, requirementId, title, priority, precondition, steps, ownerUserId, smoke, status, completeTime}
            showDialog()
        }else {
            res?.showCodeDesc()
        }
    })
}
function testCaseSubmitClick(submit) {
    if(submit) {
        let req = testCaseForm.value
        TestCase.save(req).then(res => {
            if(res?.code == 0) {
                blogic.showMessage('操作成功')
                loadTestCase()
            }else {
                res?.showCodeDesc()
            }
        })
    }
    hideDialog()
}
const iterationKey = ref(0)
function handleIterationChange() {
    iterationKey.value++
}
</script>
<template>
    <div style="padding-top: 20px">
        <el-row>
            <el-col :span="20">
                <el-form :inline="true" v-model="queryForm">
                    <el-form-item label="迭代">
                        <IterationSelect v-model="queryForm.iterationId"/>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="queryForm.title"/>
                    </el-form-item>
                    <el-form-item label="状态">
                        <DictSelect v-model="queryForm.status" dictType="testcase_status"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadTestCase">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4" style="text-align: right">
                <el-button type="primary" @click="handleAddClick">新建测试用例</el-button>
            </el-col>
        </el-row>
    </div>
    <el-table :data="testCases" border style="width:100%">
        <el-table-column prop="iterationName" label="所属迭代"/>
        <el-table-column prop="requirementName" label="关联需求"/>
        <el-table-column prop="title" label="用例标题"/>
        <el-table-column prop="priority" label="优先级"/>
        <el-table-column prop="ownerUserName" label="负责人"/>
        <el-table-column prop="smoke" label="是否冒烟"/>
        <el-table-column prop="status" label="状态"/>
        <el-table-column prop="createUserName" label="创建人"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="修改时间"/>
        <el-table-column label="操作">
            <template #=rowData>
                <el-button @click="handleViewClick(rowData.row)">查看</el-button>
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
            @current-change="handleCurrentChange"
            />
    </div>
    <el-dialog v-model="dialog" :key="dialogKey" width="55%">
        <el-form v-model="testCaseForm" label-width="100px">
            <el-form-item label="所属迭代">
                <IterationSelect v-model="testCaseForm.iterationId" @change="handleIterationChange"/>
            </el-form-item>
            <el-form-item label="关联需求">
                <RequirementSelect v-model="testCaseForm.requirementId" :iterationId="testCaseForm.iterationId" :key="iterationKey"/>
            </el-form-item>
            <el-form-item label="用例标题">
                <el-input v-model="testCaseForm.title"/>
            </el-form-item>
            <el-form-item label="优先级">
                <DictSelect v-model="testCaseForm.priority" dictType="task_priority"/>
            </el-form-item>
            <el-form-item label="前置条件">
                <RichEditor v-model:content="testCaseForm.precondition" />
            </el-form-item>
            <el-form-item label="用例步骤">
                <Steps v-model="testCaseForm.steps" />
            </el-form-item>
            <el-form-item label="用例负责人">
                <UserSelect v-model="testCaseForm.ownerUserId" :productId="testCaseForm.productId" :iterationId="testCaseForm.iterationId" :key="iterationKey" :multiple="false"/>
            </el-form-item>
            <el-form-item label="是否冒烟">
                <el-radio-group v-model="testCaseForm.smoke">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="用例状态">
                <DictSelect v-model="testCaseForm.status" dictType="testcase_status"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="testCaseSubmitClick(false)">关闭</el-button>
            <el-button type="primary" @click="testCaseSubmitClick(true)">保存</el-button>
        </template>
    </el-dialog>
</template>