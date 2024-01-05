<template>
    <MainContainer>
        <template #default>
            <el-form :model="iteration">
                <el-form-item label="迭代名称:">
                    {{ iteration.name }}
                </el-form-item>
                <el-form-item label="迭代版本号:">
                    {{ iteration.versionCode }}
                </el-form-item>
                <el-form-item label="迭代状态:">
                    {{ iteration.statusName }}
                </el-form-item>
                <el-form-item label="迭代时间:">
                    {{ iteration.scheduledStartTime }} 到 {{ iteration.scheduledEndTime }}
                </el-form-item>
                <el-form-item label="迭代参与者">
                    <el-text v-for="user in iteration.users"></el-text>
                </el-form-item>
            </el-form>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import * as blogic from '../blogic'
import {useRouter} from 'vue-router'
import {Iteration} from '../models/iteration'
import {Dict} from '../models/dict'

const params = useRouter().currentRoute.value.params
const iteration = ref({})

async function init() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('iteration_status')))
    let res = await Iteration.findOne(params.id)
    if(res?.code == 0) {
        let data = res.data
        data.statusName = statusDict[data.status]
        iteration.value = data
    }else {
        res?.showCodeDesc()
    }
}
onMounted(() => {
    init()
})
</script>