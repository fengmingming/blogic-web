<template>
    <MainContainer>
        <template #default>
            <el-form v-model="bug" label-width="100px" :key="flushKey">
                <el-form-item label="关联迭代:">
                    {{ bug.iterationName }}
                </el-form-item>
                <el-form-item label="关联需求:">
                    {{ bug.requirementName }}
                </el-form-item>
                <el-form-item label="关联用例:">
                    {{ bug.testCaseTitle }}
                </el-form-item>
                <el-form-item label="版本号:">
                    {{ bug.iterationVersion }}
                </el-form-item>
                <el-form-item label="标题:">
                    {{ bug.title }}
                </el-form-item>
                <el-form-item label="bug类型:">
                    <DictSelect v-model="bug.bugType" dictType="bug_type" :readOnly="true"/>
                </el-form-item>
                <el-form-item label="环境:">
                    <DictSelect v-model="bug.env" dictType="bug_env" :readOnly="true"/>
                </el-form-item>
                <el-form-item label="设备:">
                    {{ bug.device }}
                </el-form-item>
                <el-form-item label="重现步骤:">
                    <RichEditor v-model="bug.reproSteps" />
                </el-form-item>
                <el-form-item label="状态:">
                    <DictSelect v-model="bug.status" dictType="bug_status" :readOnly="true"/>
                </el-form-item>
                <el-form-item label="严重程度:">
                    <DictSelect v-model="bug.severity" dictType="bug_severity" :readOnly="true"/>
                </el-form-item>
                <el-form-item label="优先级:">
                    <DictSelect v-model="bug.priority" dictType="bug_priority" :readOnly="true"/>
                </el-form-item>
                <el-form-item label="指派给:">
                    {{ bug.currentUserName }}
                </el-form-item>
            </el-form>
            <el-affix position="bottom" :offset="50" style="width:100%;text-align:center">
                <el-button-group>
                    <el-button type="primary" @click="showConfirmDialog">确认</el-button>
                    <el-button type="primary" @click="showAppointDialog">指派</el-button>
                    <el-button type="primary">解决</el-button>
                </el-button-group>
            </el-affix>
        </template>
    </MainContainer>
    <el-dialog v-model="confirmDialog" :key="confirmDialogKey" width="53%">
        <el-form :model="confirmForm" :rules="confirmFormRule" label-width="100" ref="confirmFormRef">
            <el-form-item label="指派给：" prop="currentUserId">
                <UserSelect v-model="confirmForm.currentUserId" :productId="bug.productId" :iterationId="bug.iterationId" :multiple="false"/>
            </el-form-item>
            <el-form-item label="bug类型：" prop="bugType">
                <DictSelect v-model="confirmForm.bugType" dictType="bug_typee"/>
            </el-form-item>
            <el-form-item label="优先级：" prop="priority">
                <DictSelect v-model="confirmForm.priority" dictType="bug_priority"/>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <RichEditor :content="confirmForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideConfirmDialog">取消</el-button>
            <el-button type="primary" @click="submitConfirm">保存</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="appointDialog" :key="appointDialogKey" width="53%">
        <el-form :model="appointForm" :rules="appointFormRule" label-width="90" ref="appointFormRef">
            <el-form-item label="指派给：" prop="currentUserId">
                <UserSelect v-model="appointForm.currentUserId" :productId="bug.productId" :iterationId="bug.iterationId" :multiple="false"/>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <RichEditor :content="appointForm.remark"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="hideAppointDialog">取消</el-button>
            <el-button type="primary" @click="submitAppoint">保存</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import {ref, onMounted, inject} from 'vue'
import {useRouter} from 'vue-router'
import {Bug} from '../models/bug'
import * as blogic from '../blogic'

const reload = inject('reload')
const params = useRouter().currentRoute.value.params
const bug = ref({
    
})
const flushKey = ref(0)
function flush() {
    flushKey.value++
}
async function init() {
    let res = await Bug.findOne(params.id)
    if(res?.code == 0) {
        let data = Bug.toBug([res.data])[0]
        bug.value = data
        flush()
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    init()
})

//确认
const confirmDialog = ref(false)
const confirmDialogKey = ref(0)
const confirmForm = ref({})
const confirmFormRef = ref()
const confirmFormRule = ref({
    currentUserId: [{
        required: true, message:'', trigger: 'blur'
    }],
    bugType: [{
        required: true, message:'', trigger: 'blur'
    }],
    priority: [{
        required: true, message:'', trigger: 'blur'
    }],
    remark: [{
        required: false, message:'', trigger: 'blur'
    }]
})
function showConfirmDialog() {
    let {id, currentUserId, bugType, priority} = {...bug.value}
    confirmForm.value = {id, currentUserId, bugType, priority}
    confirmDialogKey.value++
    confirmDialog.value = true
}
function hideConfirmDialog() {
    confirmDialog.value = false
}
function submitConfirm() {
    confirmFormRef.value.validate((valid, fields) => {
        if(valid) {
            let param = confirmForm.value
            Bug.confirm(param).then(res => {
                if(res?.code === 0) {
                    blogic.showMessage('保存成功')
                }else {
                    res?.showCodeDesc()
                }
            })
        }
    })
}
//end
//指派
const appointDialog = ref(false)
const appointDialogKey = ref(0)
const appointForm = ref({})
const appointFormRef = ref()
const appointFormRule = ref({
    currentUserId: [{
        required: true, message:'', trigger: 'blur'
    }],
    remark: [{
        required: false, message:'', trigger: 'blur'
    }]
})
function showAppointDialog() {
    let {id, currentUserId} = {...bug.value}
    appointForm.value = {id, currentUserId}
    appointDialogKey.value++
    appointDialog.value = true
}
function hideAppointDialog() {
    appointDialog.value = false
}
function submitAppoint() {
    appointFormRef.value.validate((valid, fields) => {
        if(valid) {
            let param = appointForm.value
            Bug.appoint(param).then(res => {
                if(res?.code === 0) {
                    blogic.showMessage('保存成功')
                }else {
                    res?.showCodeDesc()
                }
            })
        }
    })
}
//end
</script>