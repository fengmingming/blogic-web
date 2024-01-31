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
                    <el-button type="primary" @click="showPauseDialog" :disabled="!(task.sttatus != 95 && task.status != 90)">暂停</el-button>
                    <el-button type="primary" @click="showResumeDialog" v-if="task.status == 30">继续</el-button>
                    <el-button type="primary" :disabled="!(task.status != 95 && task.status != 90)">工时</el-button>
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
            <el-button @click="submitAppoint" type="primary">保存</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="startDialog" :key="startDialogKey" width="53%">
        <el-form :model="startForm" :rules="startFormRules" ref="startFormRef" label-width="90px">
            <el-form-item label="指派给：" prop="currentUserId">
                <UserSelect v-model="startForm.currentUserId" :multiple="false" :productId="task.productId" :iterationId="task.iterationId"/>
            </el-form-item>
            <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker v-model="startForm.startTime" type="datetime"/>
            </el-form-item>
            <el-form-item label="进度:">
                <el-form-item prop="overallTime" label="预计" label-width="70px">
                    <el-input-number v-model="startForm.overallTime" :min="0"/>
                </el-form-item>
                <el-form-item prop="consumeTime" label="消耗" label-width="70px">
                    <el-input-number v-model="startForm.consumeTime" :min="0"/>
                </el-form-item>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <RichEditor :content="startForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideStartDialog">关闭</el-button>
            <el-button @click="submitStart" type="primary">保存</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="pauseDialog" :key="pauseDialogKey" width="53%">
        <el-form :model="pauseForm" label-width="90px">
            <el-form-item label="备注：">
                <RichEditor :content="pauseForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hidePauseDialog">关闭</el-button>
            <el-button @click="submitPause" type="primary">保存</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="resumeDialog" :key="resumeDialogKey" width="53%">
        <el-form :model="resumeForm" label-width="90px">
            <el-form-item label="备注：">
                <RichEditor :content="resumeForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideResumeDialog">关闭</el-button>
            <el-button @click="submitResume" type="primary">保存</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="cancelDialog" :key="cancelDialogKey" width="53%">
        <el-form :model="cancelForm" label-width="90px">
            <el-form-item label="备注：">
                <RichEditor :content="cancelForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideCancelDialog">关闭</el-button>
            <el-button @click="submitCancel" type="primary">保存</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="completeDialog" :key="completeDialogKey" width="53%">
        <el-form :model="completeForm" :rules="completeFormRules" ref="completeFormRef" label-width="90px">
            <el-form-item label="指派给：" prop="currentUserId">
                <UserSelect v-model="completeForm.currentUserId" :multiple="false" :productId="task.productId" :iterationId="task.iterationId"/>
            </el-form-item>
            <el-form-item prop="consumeTime" label="消耗" label-width="70px">
                <el-input-number v-model="completeForm.consumeTime" :min="0"/>
            </el-form-item>
            <el-form-item label="完成时间：" prop="startTime">
                <el-date-picker v-model="completeForm.completeTime" type="datetime"/>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <RichEditor :content="completeForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideCompleteDialog">关闭</el-button>
            <el-button @click="submitComplete" type="primary">保存</el-button>
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
//开始
const startDialog = ref(false)
const startDialogKey = ref(0)
const startForm = ref({})
const startFormRef = ref()
const startFormRules = ref({
    currentUserId:[{
        required: true, message:'', trigger:'blur'
    }],
    startTime: [{
        required: true, message:'', trigger:'blur'
    }],
    overallTime: [{
        required: true, message:'', trigger:'blur', min:0
    }],
    consumeTIme: [{
        required: true, message:'', trigger:'blur', min:0
    }]
})
function showStartDialog() {
    let {id, currentUserId, startTime, overallTime, consumeTime} = {... task.value}
    startForm.value = {id, currentUserId, startTime, overallTime, consumeTime}
    startDialogKey.value++
    startDialog.value = true
}
function hideStartDialog() {
    startDialog.value = false
}
function submitStart() {
    startFormRef.value.validate((valid, fields) => {
        if(valid) {
            Task.start(startForm.value).then(res => {
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
//Pausse
const pauseDialog = ref(false)
const pauseDialogKey = ref(0)
const pauseForm = ref({})
function showPauseDialog() {
    let {id} = {... task.value}
    pauseForm.value = {id}
    pauseDialogKey.value++
    pauseDialog.value = true
}
function hidePauseDialog() {
    pauseDialog.value = false
}
function submitPause() {
    Task.pause(pauseForm.value).then(res => {
        if(res?.code === 0) {
            blogic.showMessage('保存成功')
            reload()
        }else {
            res?.showCodeDesc()
        }
    })
}
//end
//Resume
const resumeDialog = ref(false)
const resumeDialogKey = ref(0)
const resumeForm = ref({})
function showResumeDialog() {
    let {id} = {... task.value}
    resumeForm.value = {id}
    resumeDialogKey.value++
    resumeDialog.value = true
}
function hideResumeDialog() {
    pauseDialog.value = false
}
function submitResume() {
    Task.resume(resumeForm.value).then(res => {
        if(res?.code === 0) {
            blogic.showMessage('保存成功')
            reload()
        }else {
            res?.showCodeDesc()
        }
    })
}
//end
//cancel
const cancelDialog = ref(false)
const cancelDialogKey = ref(0)
const cancelForm = ref({})
function showCancelDialog() {
    let {id} = {... task.value}
    cancelForm.value = {id}
    cancelDialogKey.value++
    cancelDialog.value = true
}
function hideCancelDialog() {
    cancelDialog.value = false
}
function submitCancel() {
    Task.cancel(cancelForm.value).then(res => {
        if(res?.code === 0) {
            blogic.showMessage('保存成功')
            reload()
        }else {
            res?.showCodeDesc()
        }
    })
}
//end
//complete
const completeDialog = ref(false)
const completeDialogKey = ref(0)
const completeForm = ref({})
const completeFormRef = ref()
const completeFormRules = ref({
    currentUserId:[{
        required: true, message:'', trigger:'blur'
    }],
    completeTime: [{
        required: true, message:'', trigger:'blur'
    }],
    consumeTIme: [{
        required: true, message:'', trigger:'blur', min:0
    }]
})
function showCompleteDialog() {
    let {id, currentUserId} = {... task.value}
    let consumeTime = 0
    completeForm.value = {id, currentUserId, consumeTime}
    completeDialogKey.value++
    completeDialog.value = true
}
function hideCompleteDialog() {
    completeDialog.value = false
}
function submitComplete() {
    completeFormRef.value.validate((valid, fields) => {
        if(valid) {
            Task.complete(completeForm.value).then(res => {
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