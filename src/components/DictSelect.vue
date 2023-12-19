<script setup>
import {ref, onMounted} from 'vue'
import {Dict} from '../models/dict'

const props = defineProps({
    dictType: {
        type: String,
        required: true
    },
    modelValue: {
        type: Number,
        default: null
    },
    multiple: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:modelValue'])
const dictDatas = ref([])
const value = ref(props.modelValue)
onMounted(() => {
    Dict.findByDictType(props.dictType).then(res => {
        if(res?.code == 0) {
            dictDatas.value = Dict.toDict(res.data)
        }else {
            res?.showCodeDesc()
        }
    })
})
function handleChange(arg) {
    emits('update:modelValue', arg)
}
</script>
<template>
    <el-select v-model="value" @change="handleChange" :multiple="props.multiple" clearable>
        <el-option v-for="data in dictDatas" :value="data.code" :label="data.codeDesc" :key="data.id"/>
    </el-select>
</template>
