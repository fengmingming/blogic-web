<script setup>
import {ref, onMounted} from 'vue'
import {TestCase} from '../models/testcase'

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    },
    clearable: {
        type: Boolean,
        default: true
    },
    iterationId: {
        type:Number,
        default: null
    },
    requirementId: {
        type: Number,
        default: null
    }
})
const emits = defineEmits(['update:modelValue', 'change'])
const value = ref(props.modelValue)
const testCases = ref([])
const loading = ref(false)

function handleChange(value) {
    emits('update:modelValue', value)
    emits('change', value)
}

onMounted(() => {
    loadTestCase('')
})

async function loadTestCase(key) {
    loading.value = true
    let res = await TestCase.findList({title:key, iterationId: props.iterationId, requirementId: props.requirementId})
    loading.value = false
    if(res?.code == 0) {
        testCases.value = TestCase.toTestCase(res.data.records)
    }else {
        res?.showCodeDesc()
    }
}

function remoteMethod(key) {
    if(key) {
        loadTestCase(key)
    }
}
</script>
<template>
    <el-select v-model="value" filterable reserve-keyword remote :remote-method="remoteMethod" :loading="loading" @change="handleChange" :clearable="props.clearable">
        <el-option v-for="testCase in testCases" :key="testCase.id" :label="testCase.title" :value="testCase.id" />
    </el-select>
</template>