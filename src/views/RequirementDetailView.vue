<template>
    <MainContainer>
        <template #header>
            <el-button type="primary" :icon="Back" circle @click="router.back()" color="#ecf5ff"/>
        </template>
        <template #default>
            <el-form v-model="requirement">
                <el-form-item label="需求名称:">
                    {{ requirement.requirementName }}
                </el-form-item>
                <el-form-item label="需求来源:">
                    {{ requirement.requirementSources }}
                </el-form-item>
                <el-form-item label="需求状态:">
                    {{ requirement.requirementStatusName }}
                </el-form-item>
                <el-form-item label="创建人:">
                    {{ requirement.createUserName }} {{ requirement.createTime }}
                </el-form-item>
                <el-form-item label="需求描述:">
                    <RichEditor v-model:content="requirement.requirementDesc" :disabled="true" v-if="requirement.requirementDesc"/>
                </el-form-item>
            </el-form>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import * as blogic from '../blogic'
import {Requirement} from '../models/requirement'
import {Dict} from '../models/dict'
import {useRouter} from 'vue-router'
import {Back} from '@element-plus/icons-vue'

const router = useRouter()
const params = router.currentRoute.value.params
const requirement = ref({})
async function init() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('requirement_status')))
    let res = await Requirement.findOne(params.id)
    if(res?.code == 0) {
        let data = Requirement.toRequirement([res.data])[0]
        data.requirementStatusName = statusDict[data.requirementStatus]
        requirement.value = data
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    init()
})
</script>