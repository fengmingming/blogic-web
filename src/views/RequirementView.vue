<script setup>
import {ref, inject, onMounted} from 'vue'
import {Requirement} from '../models/requirement'
import * as blogic from '../blogic'
import {Dict} from '../models/dict'
import {useRouter} from 'vue-router'

const router = useRouter()
const reload = inject('reload')
const requirements = ref([])
const total = ref(0)
const queryForm = ref({
    pageSize: 10,
    pageNum: 1,
    requirementName: '',
    requirementSources: '',
    requirementStatus: null,
    createUserId: null
})
async function loadRequirement() {
    let res = await Requirement.findList({...queryForm.value})
    res = blogic.handleResponse(res)
    res.records.forEach(a => {
        a.requirementStatus = requirementStatusDict.value[a.requirementStatus]
    })
    requirements.value = res.records
    total.value = res.total
}

function handleSizeChange(pageSize) {
    queryForm.value.pageSize = pageSize
    queryForm.value.pageNum = 1
    loadRequirement()
}

function handleCurrentChange(pageNum) {
    queryForm.value.pageNum = pageNum
    loadRequirement()
}
const requirementStatusDict = ref({})
onMounted(() => {
    Dict.findByDictType('requirement_status').then(res => {
        if(res?.code == 0) {
            requirementStatusDict.value = Dict.toMap(res.data)
            loadRequirement()
        }else {
            res?.showCodeDesc()
        }
    })
})
//新增，编辑需求
const emptyRequirement = {
    id: null,
    requirementName:'',
    requirementSources:'',
    requirementDesc:'',
    requirementStatus: null
}
const requirementForm = ref(emptyRequirement)
const requirementFormRef = ref()
const requirementFormRules = ref({
    requirementName: [{
        required: true, message:'', trigger: 'blur'
    },{
        max: 200, message:'最多200字', trigger: 'blur'
    }],
    requirementSources: [{
        required: true, message:'', trigger: 'blur'
    },{
        max: 200, message: '最多200字', trigger:'blur'
    }],
    requirementDesc: [{
        required: true, message:'', trigger: 'blur'
    }],
    requirementStatus: [{
        required: true, message:'', trigger: 'change'
    }]
})
const editDialog = ref(false)
const richEditorKey = ref(1)
function showDialog() {
    richEditorKey.value++
    editDialog.value = true
}
function hideDialog() {
    editDialog.value = false
}
function handleAddClick() {
    requirementForm.value = {... emptyRequirement}
    showDialog()
}
function handleViewClick(arg) {
    router.push(`/requirement/${arg.id}`)
}
async function handleEditClick(arg) {
    let requirement = blogic.handleResponse(await Requirement.findOne(arg.id))
    let {id, requirementName, requirementSources, requirementDesc, requirementStatus} = {... requirement}
    requirementForm.value = {id, requirementName, requirementSources, requirementDesc, requirementStatus}
    showDialog()
}
function submitClick(submit) {
    if(submit) {
        requirementFormRef.value.validate((valid, fields) => {
            if(valid) {
                let {id, requirementName, requirementSources, requirementDesc, requirementStatus} = {... requirementForm.value}
                Requirement.save({id, requirementName, requirementSources, requirementDesc, requirementStatus}).then(res => {
                    if(res?.code == 0) {
                        blogic.showMessage('操作成功')
                        hideDialog()
                        loadRequirement()
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
    <MainContainer>
        <template #header>
            <CompanyProductSelection />
        </template>
        <template #default>
            <div>
                <el-row>
                    <el-col :span="22">
                        <el-form :inline="true" v-model="queryForm">
                            <el-form-item label="需求名称">
                                <el-input clearable v-model="queryForm.requirementName"/>
                            </el-form-item>
                            <el-form-item label="需求来源">
                                <el-input clearable v-model="queryForm.requirementSources"/>
                            </el-form-item>
                            <el-form-item label="需求状态">
                                <DictSelect v-model="queryForm.requirementStatus" dictType="requirement_status"/>
                            </el-form-item>
                            <el-form-item label="创建人">
                                <UserSelect v-model="queryForm.createUserId" :multiple="false"/>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="loadRequirement">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2" style="text-align: right;">
                        <el-button type="primary" @click="handleAddClick">新建需求</el-button>
                    </el-col>
                </el-row>
            </div>
            <div style="padding-top: 20px">
                <el-table :data="requirements" border style="width: 100%">
                    <el-table-column prop="requirementName" label="需求名称" />
                    <el-table-column prop="requirementSources" label="需求来源" />
                    <el-table-column prop="requirementStatus" label="需求状态" />
                    <el-table-column prop="createUserName" label="创建人" />
                    <el-table-column prop="createTime" label="创建时间" />
                    <el-table-column prop="updateTime" label="修改时间" />
                    <el-table-column label="操作">
                        <template #="rowData">
                            <el-button @click="handleViewClick(rowData.row)">查看</el-button>
                            <el-button @click="handleEditClick(rowData.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="padding: 10px 10px;text-align: center;">
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
    <el-dialog v-model="editDialog" :key="richEditorKey">
        <el-form :model="requirementForm" ref="requirementFormRef" :rules="requirementFormRules">
            <el-form-item label="需求名称" prop="requirementName">
                <el-input v-model="requirementForm.requirementName" />
            </el-form-item>
            <el-form-item label="需求来源" prop="requirementSources">
                <el-input v-model="requirementForm.requirementSources" />
            </el-form-item>
            <el-form-item label="需求状态" v-if="requirementForm.id" prop="requirementStatus">
                <DictSelect v-model="requirementForm.requirementStatus" dictType="requirement_status"/>
            </el-form-item>
            <el-form-item label="需求描述" prop="requirementDesc">
                <RichEditor v-model:content="requirementForm.requirementDesc"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="submitClick(false)">关闭</el-button>
            <el-button type="primary" @click="submitClick(true)">保存</el-button>
        </template>
    </el-dialog>
</template>