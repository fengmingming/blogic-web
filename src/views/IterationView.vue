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

function showDialog() {

}

onMounted(() => {
    Dict.findByDictType('iteration_status').then(res => {
        iterationStatusDict.value = Dict.toMap(blogic.handleResponse(res))
        loadIteration()
    })
})
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
                    <el-button type="primary" @click="showDialog">新建迭代</el-button>
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
                </el-table>
            </div>
        </template>
    </MainContainer>
</template>