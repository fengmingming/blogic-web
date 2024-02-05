<template>
    <MainContainer>
        <template #header>
            <el-button type="primary" :icon="Back" circle @click="router.back()" color="#ecf5ff"/>
        </template>
        <template #default>
            <el-form v-model="testCase" :key="flushKey" label-width="100px">
                <el-form-item label="所属迭代:">
                    {{ testCase.iterationName }}
                </el-form-item>
                <el-form-item label="关联需求:">
                    {{ testCase.requirementName }}
                </el-form-item>
                <el-form-item label="用例标题:">
                    {{ testCase.title }}
                </el-form-item>
                <el-form-item label="优先级:">
                    {{ testCase.priority }}
                </el-form-item>
                <el-form-item label="前置条件:">
                    <RichEditor v-model:content="testCase.precondition" :disabled="true" v-if="testCase.precondition"/>
                </el-form-item>
                <el-form-item label="用例步骤:">
                    <Steps v-model="testCase.steps" :readOnly="true" v-if="testCase.steps.length > 0"/>
                </el-form-item>
                <el-form-item label="用例负责人:">
                    {{ testCase.ownerUserName }}
                </el-form-item>
                <el-form-item label="是否冒烟:">
                    <span v-if="testCase.smoke === true">是</span><span v-if="testCase.smoke === false">否</span>
                </el-form-item>
                <el-form-item label="用例状态:">
                    <DictSelect v-model="testCase.status" dictType="testcase_status" :readOnly="true"/>
                </el-form-item>
            </el-form>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {TestCase} from '../models/testcase'
import {useRouter} from 'vue-router'
import {Back} from '@element-plus/icons-vue'

const params = useRouter().currentRoute.value.params
const testCase = ref({steps:[]})
const flushKey = ref(0)
function flush() {
    flushKey.value++
}
async function init() {
    let res = await TestCase.findOne(params.id)
    if(res?.code == 0) {
        testCase.value = res.data
        flush()
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    init()
})
</script>