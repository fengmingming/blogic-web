<script setup>
import {ref, onMounted} from 'vue'
import {TestCase} from '../models/testcase'
import * as blogic from '../blogic'

const queryForm = ref({
    iterationId: null,
    title: '',
})
const testCases = ref([])
function loadTestCase() {

}
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
    iterationId:null,
    requirementId:null,
    title:'',
    priority:null,
    precondition:'',
    ownerUserId:null,
    smoke:null,
    status:null,
    completeTime:null
}
const testCaseForm = ref(emptyTestCase)
function handleAddClick() {
    testCaseForm.value = emptyTestCase
    showDialog()
}
function handleEditClick(testCase) {
    TestCase.findOne(testCase.id).then(res => {
        if(res?.code == 0) {
            let {id, iterationId, requirementId, title, priority, precondition, ownerUserId, smoke, status, completeTime} = {... res.data}
            let form = {id, iterationId, requirementId, title, priority, precondition, ownerUserId, smoke, status, completeTime}
            form.steps = JSON.parse(res.data.steps)
            testCaseForm.value = from
        }else {
            res?.showCodeDesc()
        }
    })
}
function testCaseSubmitClick(submit) {
    if(submit) {
        let req = testCaseForm.value
        req.steps = []
        TestCase.save(req).then(res => {
            if(res?.code == 0) {
                blogic.showMessage('操作成功')
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
        <el-table-column prop="statusDesc" label="状态"/>
        <el-table-column prop="createUserName" label="创建人"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="修改时间"/>
        <el-table-column label="操作">
            <template #rowData>
                <el-button @click="handleEditClick(rowData.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
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
            <el-form-item label="步骤">
                
            </el-form-item>
            <el-form-item label="用例负责人">
                <UserSelect v-model="testCaseForm.ownerUserId" :productId="testCaseForm.productId" :iterationId="testCaseForm.iterationId" :key="iterationKey" :multiple="false"/>
            </el-form-item>
            <el-form-item label="是否冒烟">
                <el-radio-group v-model="testCaseForm.smoke">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
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