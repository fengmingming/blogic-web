<script setup>
import {ref, onMounted} from 'vue'
import {Requirement} from '../models/requirement'
const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    },
    iterationId: {
        type: Number,
        default: null
    },
    multiple: {
        type: Boolean,
        default: false
    },
    clearable: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['update:modelValue', 'change'])
const value = ref(props.modelValue)
const requirements = ref([])
const loading = ref(false)
function handleChange(value) {
    emits('update:modelValue', value)
    emits('change', value)
}
function loadRequirement(key) {
    loading.value = true
    Requirement.findList({requirementName: key, iterationId: props.iterationId}).then(res => {
        if(res?.code == 0) {
            let objs = []
            res.data.records.forEach(obj => {
                objs.push({id: obj.id, name: obj.requirementName})
            })
            requirements.value = objs
        }else {
            res?.showCodeDesc()
        }
        loading.value = false
    }).catch(err => {
        loading.value = false
    })
}
function remoteMethod(key) {
    if(key) {
        loadRequirement(key)
    }
}
onMounted(() => {
    loadRequirement('')
})
</script>
<template>
    <el-select v-model="value" filterable reserve-keyword remote :remote-method="remoteMethod" :loading="loading" 
        :multiple="props.multiple" @change="handleChange" :clearable="props.clearable">
        <el-option v-for="requirement in requirements" :key="requirement.id" :label="requirement.name" :value="requirement.id" />
    </el-select>
</template>