<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Model} from '../models/Model'

const router = useRouter()
const models = ref([])
const queryForm = ref({
    pageSize: 10,
    pageNum: 1,
    name: ''
})
const total = ref(0)
function loadModels() {
    Model.findList({...queryForm.value}).then(res => {
        if(res?.code == 0) {
            let records = res.data.records
            records.forEach(it => it.size = it.data.length)
            models.value = res.data.records
            total.value = res.data.total
        }else {
            res?.showCodeDesc()
        }
    })
}
function handleAddClick() {
    router.push('/model')
}
function handleViewClick(model) {
    router.push({
        path: '/model',
        query: {
            modelId: model.id,
            readonly: true
        }
    })
}
function handleEditClick(model) {
    router.push({
        path: '/model',
        query: {
            modelId: model.id
        }
    })
}
function handleSizeChange(pageSize) {
    queryForm.value = pageSize
    loadModels()
}
function handleCurrentChange(pageNum) {
    queryForm.value = pageNum
    loadModels()
}
function countUtf8Bytes(row, column, value, index) {
    if(!value) return 0
    let encoder = new TextEncoder()
    let uintArr = encoder.encode(value)
    return uintArr.length
}
onMounted(() => {
    loadModels()
})

</script>
<template>
    <MainContainer>
        <template #header>
          <CompanyProductSelection />
        </template>
        <template #default>
            <div style="padding-top: 20px">
                <el-row>
                    <el-col :span="22">
                        <el-form :inline="true" v-model="queryForm">
                            <el-form-item label="模型名称" style="width: 600px">
                                <el-input type="text" v-model="queryForm.name"/>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="loadModels">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2" style="text-align: right">
                        <el-button type="primary" @click="handleAddClick">新建模型</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="models" border style="width:100%">
                <el-table-column prop="name" label="模型名称" />
                <el-table-column prop="data" label="模型文件大小" width="200px" :formatter="countUtf8Bytes"/>
                <el-table-column prop="createTime" label="创建时间" width="200px"/>
                <el-table-column prop="updateTime" label="修改时间" width="200px"/>
                <el-table-column label="操作" fixed="right" width="170px">
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
        </template>
    </MainContainer>
</template>