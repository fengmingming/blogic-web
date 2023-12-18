<script setup>
import {ref, inject} from 'vue'

const reload = inject('reload')
const requirements = ref([])
const total = ref(0)
const queryForm = ref({
    pageSize: 10,
    pageNum: 1,
    requirementName: '',
    requirementStatus: ''
})
function loadRequirement() {

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

function edit(requirement) {

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
                    <el-col :span="12">
                        <el-form :inline="true" v-model="queryForm">
                            <el-form-item label="需求名称">
                                <el-input clearable v-model="queryForm.requirementName"/>
                            </el-form-item>
                            <el-form-item label="需求状态">
                                <DictSelect v-model="queryForm.requirementStatus" dictType="requirement_status"/>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <el-button type="primary" @click="loadRequirement">新建需求</el-button>
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
                            <el-button @click="edit(rowData.row)">编辑</el-button>
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
</template>