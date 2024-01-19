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
                    <DictSelect v-model="task.status" dictType="task_status" :readOnly="true" v-if="task.status"/>
                </el-form-item>
                <el-form-item label="优先级:">
                    <DictSelect v-model="task.priority" dictType="task_priority" :readOnly="true" v-if="task.priority"/>
                </el-form-item>
                <el-form-item label="进度:">
                    <el-col :span="1" style="text-align:right;padding-right: 15px;">
                        <span>预计</span>
                    </el-col>
                    <el-col :span="1">
                        {{ task.overallTime }}
                    </el-col>
                    <el-col :span="1" style="text-align:right;padding-right: 15px;">
                        <span>消耗</span>
                    </el-col>
                    <el-col :span="1">
                        {{ task.consumeTime }}
                    </el-col>
                    <el-col :span="20"/>
                </el-form-item>
                <el-form-item label="指派给:">
                    {{ task.currentUserName }}
                </el-form-item>
                <el-form-item label="任务描述:">
                    <RichEditor v-model:content="task.taskDesc" :disabled="true" v-if="task.taskDesc"/>
                </el-form-item>
            </el-form>
            <el-affix position="bottom" :offset="100" style="width:100%;text-align:center">
                <el-button-group>
                    <el-button type="primary">子任务</el-button>
                    <el-button type="primary">指派</el-button>
                    <el-button type="primary">开始</el-button>
                    <el-button type="primary">工时</el-button>
                    <el-button type="primary">完成</el-button>
                    <el-button type="primary">取消</el-button>
                </el-button-group>
            </el-affix>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Task} from '../models/task'

const params = useRouter().currentRoute.value.params
const task = ref({})

async function init() {
    let res = await Task.findOne(params.id)
    if(res?.code == 0) {
        let data = Task.toTask([res.data])[0]
        task.value = data
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    init()
})
</script>