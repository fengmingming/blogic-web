<script setup>
import {ref, onMounted} from 'vue'
import {Iteration} from '../models/iteration'
import {Dict} from '../models/dict'
import * as blogic from '../blogic'
import {useRouter} from 'vue-router'

const router = useRouter()
const queryForm = ref({
    name: '',
    status: null,
    createUserId: null,
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
    productId: blogic.getCurProductId(),
    status: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    userIds: []
}
const iterationForm = ref(emptyIteration)
const iterationFormRef = ref()
const iterationFormRules = ref({
    name: [{
        required: true, trigger:'blur', message: ''
    },{
        max: 200, trigger: 'blur', message: '最多200字'
    }],
    status:[{
        required: true, trigger:'blur', message: ''
    }],
    versionCode:[{
        required: true, trigger:'blur', message: ''
    }, {
        max: 50, trigger:'blur', message: '最多50个字'
    }]
})
function showDialog() {
    dialog.dialogKey++
    dialog.value = true
}
function hideDialog() {
    dialog.value = false
}
function handleAddClick() {
    iterationForm.value = {... emptyIteration}
    showDialog()
}
function iterationSubmitClick(submit) {
    if(submit) {
        iterationFormRef.value.validate((valid, fields) => {
            if(valid) {
                let {id, name, versionCode, status, scheduledStartTime, scheduledEndTime, userIds} = {... iterationForm.value}
                Iteration.save({id, name, versionCode, status, scheduledStartTime, scheduledEndTime, userIds}).then(res => {
                    if(res?.code == 0) {
                        blogic.showMessage('操作成功')
                        hideDialog()
                        loadIteration()
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
function handleViewClick(iteration) {
    router.push(`/iteration/${iteration.id}`)
}
async function handleEditClick(iteration) {
    let res = await Iteration.findOne(iteration.id)
    res = blogic.handleResponse(res)
    iteration = new Iteration(res)
    iteration.userIds = iteration.users?.map(it => it.id)
    iterationForm.value = iteration
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
                <el-col :span="22">
                    <el-form :inline="true" v-model="queryForm">
                        <el-form-item label="迭代名称">
                            <el-input v-model="queryForm.name"/>
                        </el-form-item>
                        <el-form-item label="迭代状态">
                            <DictSelect v-model="queryForm.status" dictType="iteration_status"/>
                        </el-form-item>
                        <el-form-item label="创建人">
                            <UserSelect v-model="queryForm.createUserId" :multiple="false"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loadIteration">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="2" style="text-align: right;">
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
                    <el-table-column label="操作" fixed="right" width="200px">
                        <template #="rowData">
                            <el-button @click="handleViewClick(rowData.row)">查看</el-button>
                            <el-button @click="handleEditClick(rowData.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </MainContainer>
    <el-dialog v-model="dialog" :key="dialogKey">
        <el-form :model="iterationForm" label-width="100px" :rules="iterationFormRules" ref="iterationFormRef">
            <el-form-item label="迭代名称" prop="name">
                <el-input v-model="iterationForm.name"/>
            </el-form-item>
            <el-form-item label="迭代版本号" prop="versionCode">
                <el-input v-model="iterationForm.versionCode" />
            </el-form-item>
            <el-form-item label="迭代状态" prop="status" v-if="iterationForm.id">
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
            <el-form-item label="迭代参与者">
                <UserSelect v-model="iterationForm.userIds" :productId="iterationForm.productId"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="iterationSubmitClick(false)">关闭</el-button>
            <el-button type="primary" @click="iterationSubmitClick(true)">保存</el-button>
        </template>
    </el-dialog>
</template>