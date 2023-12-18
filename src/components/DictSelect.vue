<script setup>
import {ref, defineProps, defineEmits, onMounted} from 'vue'
import {Dict} from '../models/dict'

const props = defineProps({
    dictType: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ''
    },
    multiple: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:value'])
const dictDatas = ref([])
onMounted(() => {
    Dict.findByCode(props.dictType).then(res => {
        if(res?.code == 0) {
            dictDatas.value = Dict.toDict(res.data)
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>
<template>
    <el-select v-model="props.value" @change="emits('update:value')" :multiple="props.multiple">
        <el-option v-for="data in dictDatas" :value="data.code" :label="data.codeDesc" :key="data.id"/>
    </el-select>
</template>
