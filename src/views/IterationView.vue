<script setup>
import {ref, onMounted} from 'vue'
import {Iteration} from '../models/iteration'
import {Dict} from '../models/dict'
import * as blogic from '../blogic'

const queryForm = ref({
    name: '',
    status: null,
    pageNum: 1,
    pageSize: 10
})
const iterations = ref([])
const total = ref(0)
const iterationStatusDict = ref({})

async function loadIteration() {
    let res = blogic.handleResponse(await Iteration.findList(queryForm.value))
    res.records.forEach(it => {
        it.status = iterationStatusDict.value[it.status]
    })
    iterations.value = res.records
    total.value = res.total
}

onMounted(() => {
    Dict.findByDictType('iteration_status').then(res => {
        iterationStatusDict.value = Dict.toMap(blogic.handleResponse(res))
        loadIteration()
    })
})

const dialog = ref(false)
const dialogKey = ref(0)
const emptyIteration = {
    id:null,
    name:null,
    versionCode:null,
    status:null,
    scheduledStartTime:null,
    scheduledEndTime:null,
}
const iterationForm = ref(emptyIteration)
function showDialog() {
    dialog.dialogKey++
    dialog.value = true
}
function hideDialog() {
    dialog.value = false
}
function handleAddClick() {
    iterationForm.value = emptyIteration
    showDialog()
}
async function iterationSubmitClick(submit) {
    if(submit) {
        let {id, name, versionCode, status, scheduledStartTime, scheduledEndTime} = {... iterationForm.value}
        let res = await Iteration.save({id, name, versionCode, status, scheduledStartTime, scheduledEndTime})
        if(res?.code == 0) {
            blogic.showMessage('操作成功')
            loadIteration()
        }else {
            res?.showCodeDesc()
        }
    }
    hideDialog()
}
async function handleEditClick(iteration) {
    let res = await Iteration.findOne(iteration.id)
    res = blogic.handleResponse(res)
    iterationForm.value = new Iteration(res)
    showDialog()
}
</script>
<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection />
        </template>
        <template #default>
            <el-row>
                <el-col :span="12">
                    <el-form :inline="true" v-model="queryForm">
                        <el-form-item label="迭代名称">
                            <el-input v-model="queryForm.name"/>
                        </el-form-item>
                        <el-form-item label="迭代状态">
                            <DictSelect v-model="queryForm.status" dictType="iteration_status"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loadIteration">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" @click="handleAddClick">新建迭代</el-button>
                </el-col>
            </el-row>
            <div style="padding-top: 20px">
                <el-table :data="iterations" border style="width: 100%">
                    <el-table-column prop="name" label="迭代名称"/>
                    <el-table-column prop="versionCode" label="迭代版本"/>
                    <el-table-column prop="scheduledStartTime" label="开始时间"/>
                    <el-table-column prop="scheduledEndTime" label="结束时间"/>
                    <el-table-column prop="status" label="状态"/>
                    <el-table-column prop="createTime" label="创建时间"/>
                    <el-table-column prop="updateTime" label="最后修改时间"/>
                    <el-table-column label="操作">
                        <template #="rowData">
                            <el-button @click="handleEditClick(rowData.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </MainContainer>
    <el-dialog v-model="dialog" :key="dialogKey">
        <el-form :model="iterationForm" label-width="100px">
            <el-form-item label="迭代名称">
                <el-input v-model="iterationForm.name"/>
            </el-form-item>
            <el-form-item label="迭代版本号">
                <el-input v-model="iterationForm.versionCode" />
            </el-form-item>
            <el-form-item label="迭代状态">
                <DictSelect v-model="iterationForm.status" dictType="iteration_status" />
            </el-form-item>
            <el-form-item label="迭代时间">
                <el-col :span="11">
                    <el-date-picker v-model="iterationForm.scheduledStartTime" type="date" size="default" value-format="YYYY-MM-DD" placeholder="迭代开始时间" style="width:100%"/>
                </el-col>
                <el-col :span="2" style="text-align: center;">
                    <span>到</span>
                </el-col>
                <el-col :span="11">
                    <el-date-picker v-model="iterationForm.scheduledEndTime" type="date" size="default" value-format="YYYY-MM-DD" placeholder="迭代结束时间" style="width:100%"/>
                </el-col>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="iterationSubmitClick(false)">关闭</el-button>
                <el-button type="primary" @click="iterationSubmitClick(true)">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>