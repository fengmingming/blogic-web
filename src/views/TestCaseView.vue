<script setup>
import {ref, onMounted} from 'vue'

const queryForm = ref({
    iterationId: null,
    title: '',
})
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

}
const testCaseForm = ref(emptyTestCase)
function handleAddClick() {
    testCaseForm.value = emptyTestCase
    showDialog()
}
function handleEditClick() {
    
}
</script>
<template>
    <div style="padding-top: 20px">
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
        <el-col :span="4">
            <el-button type="primary" @click="handleAddClick">新建测试用例</el-button>
        </el-col>
    </div>
</template>