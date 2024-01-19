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
            <el-affix position="bottom" :offset="100" style="width:100%;text-align:center">
                <el-button-group>
                    <el-button type="primary">确认</el-button>
                    <el-button type="primary">指派</el-button>
                    <el-button type="primary">解决</el-button>
                </el-button-group>
            </el-affix>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Bug} from '../models/bug'

const params = useRouter().currentRoute.value.params
const bug = ref({})
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
</script>