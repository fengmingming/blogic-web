<template>
    <MainContainer>
        <template #default>
            <el-form v-model="task" label-width="100px">
                <el-form-item label="任务名称:">
                    {{ task.taskName }}
                </el-form-item>
                <el-form-item label="所属迭代:" >
                    {{ task.iterationName }}
                </el-form-item>
                <el-form-item label="关联需求:" >
                    {{ task.requirementName }}
                </el-form-item>
                <el-form-item label="任务状态:">
                    {{ task.statusName }}
                </el-form-item>
                <el-form-item label="优先级:">
                    {{ task.priority }}
                </el-form-item>
                <el-form-item label="进度:">
                    <el-col :span="2" style="text-align:right;padding-right: 15px;">
                        <span>预计</span>
                    </el-col>
                    <el-col :span="3">
                        {{ taskForm.overallTime }}
                    </el-col>
                    <el-col :span="4"></el-col>
                    <el-col :span="2" style="text-align:right;padding-right: 15px;">
                        <span>消耗</span>
                    </el-col>
                    <el-col :span="3">
                        {{ taskForm.consumeTime }}
                    </el-col>
                    <el-col :span="10"/>
                </el-form-item>
                <el-form-item label="指派给:">
                    {{ taskForm.currentUserName }}
                </el-form-item>
                <el-form-item label="任务描述:">
                    <RichEditor v-model:content="taskForm.taskDesc" :disabled="true" v-if="taskForm.taskDesc"/>
                </el-form-item>
            </el-form>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Task} from '../models/task'
import {Dict} from '../models/dict'
import * as blogic from '../blogic'

const params = useRouter().currentRoute.value.params
const task = ref({})

async function init() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('task_status')))
    let res = await Task.findOne(params.id)
    if(res?.code == 0) {
        let data = Task.toTask([res.data])[0]
        data.statusName = statusDict[data.status]
        task.value = data
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    init()
})
</script>