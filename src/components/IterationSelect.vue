<script setup>
import {ref, onMounted} from 'vue'
import {Iteration} from '../models/iteration'

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    },
    clearable: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['update:modelValue', 'change'])
const loading = ref(false)
const iterations = ref([])
const value = ref(props.modelValue)
function handleChange(value) {
    emits('update:modelValue', value)
    emits('change', value)
}
function loadIteration(key) {
    loading.value = true
    Iteration.findList({name: key}).then(res => {
        if(res?.code == 0) {
            let objs = []
            res.data.records.forEach(obj => {
                objs.push({id: obj.id, name: obj.name})
            })
            iterations.value = objs
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
        loadIteration(key)
    }
}
onMounted(() => {
    loadIteration('')
})
</script>
<template>
    <el-select v-model="value" filterable reserve-keyword remote :remote-method="remoteMethod" :loading="loading" @change="handleChange" :clearable="props.clearable">
        <el-option v-for="iteration in iterations" :key="iteration.id" :label="iteration.name" :value="iteration.id" />
    </el-select>
</template>