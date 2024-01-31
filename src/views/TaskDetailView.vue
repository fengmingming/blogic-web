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
                <el-form-item label="任务状态:" >
                    <DictSelect v-model="task.status" dictType="task_status" :readOnly="true" v-if="task.status"/>
                </el-form-item>
                <el-form-item label="优先级:" >
                    <DictSelect v-model="task.priority" dictType="task_priority" :readOnly="true" v-if="task.priority"/>
                </el-form-item>
                <el-form-item label="进度:" >
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
            <el-affix position="bottom" :offset="50" style="width:100%;text-align:center">
                <el-button-group>
                    <el-button type="primary">子任务</el-button>
                    <el-button type="primary" @click="showAppointDialog" :disabled="!(task.status != 95)">指派</el-button>
                    <el-button type="primary" @click="showStartDialog" :disabled="!(task.status == 10)">开始</el-button>
                    <el-button type="primary" @click="showPauseDialog" :disabled="!(ask.status != 95 && task.status != 90)">暂停</el-button>
                    <el-button type="primary" @click="showResumeDialog" v-if="task.status == 30">继续</el-button>
                    <el-button type="primary" @click="showDPDialog" :disabled="!(task.status != 95 && task.status != 90)">工时</el-button>
                    <el-button type="primary" @click="showCompleteDialog" :disabled="!(task.status != 95)">完成</el-button>
                    <el-button type="primary" @click="showCancelDialog" :disabled="!(task.status != 90)">取消</el-button>
                </el-button-group>
            </el-affix>
        </template>
    </MainContainer>
    <el-dialog v-model="appointDialog" :key="appointDialogKey" width="53%">
        <el-form :model="appointForm" :rules="appointFormRules" ref="appointFormRef" label-width="90px">
            <el-form-item label="指派给：" prop="currentUserId">
                <UserSelect v-model="appointForm.currentUserId" :multiple="false" :productId="task.productId" :iterationId="task.iterationId"/>
            </el-form-item>
            <el-form-item label="消耗时间：" prop="consumeTime">
                <el-input-number v-model="appointForm.consumeTIme" :min="0"/>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <RichEditor :content="appointForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideAppointDialog">关闭</el-button>
            <el-button @click="submitAppoint" type="primary">确认</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import {ref, onMounted, inject} from 'vue'
import {useRouter} from 'vue-router'
import {Task} from '../models/task'
import * as blogic from '../blogic'

const reload = inject('reload')
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
//指派
const appointDialog = ref(false)
const appointDialogKey = ref(0)
const appointForm = ref({})
const appointFormRef = ref()
const appointFormRules = ref({
    currentUserId:[{
        required: true, message:'', trigger:'blur'
    }],
    consumeTIme: [{
        required: true, message:'', trigger:'blur', min:0
    }]
})
function showAppointDialog() {
    let {currentUserId, id} = {... task.value}
    let consumeTIme = 0 
    appointForm.value = {id, currentUserId, consumeTIme}
    appointDialogKey.value++
    appointDialog.value = true
}
function hideAppointDialog() {
    appointDialog.value = false
}
function submitAppoint() {
    appointFormRef.value.validate((valid, fields) => {
        if(valid) {
            Task.appoint(appointForm.value).then(res => {
                if(res?.code === 0) {
                    blogic.showMessage('保存成功')
                    reload()
                }else {
                    res?.showCodeDesc()
                }
            })
        }
    })
}
//end
</script>