<script setup>
import {ref, onMounted} from 'vue'
import {User} from '../models/user'

const props = defineProps({
    multiple: {
        type: Boolean,
        default: true
    },
    modelValue: {
        type: Array,
        default: []
    },
    productId: {
        type: Number,
        default: null
    },
    iterationId: {
        type: Number,
        default: null
    },
    clearable: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['update:modelValue'])
const users = ref([])
const value = ref(props.multiple?props.modelValue:props.modelValue[0])
function handleChange(arr) {
    emits('update:modelValue', arr)
}
onMounted(() => {
    let promise
    if(props.iterationId) {
        promise = User.findByIterationId(props.iterationId)
    }else if(props.productId) {
        promise = User.findByProductId(props.productId)
    }else {
        promise = User.findAll()
    }
    promise.then(res => {
        if(res?.code == 0) {
            let objs = []
            res.data.forEach(it => {
                objs.push({id:it.id, userDesc: it.name})
            })
            users.value = objs
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>
<template>
    <el-select v-model="value" filterable :multiple="props.multiple" :clearable="props.clearable" @change="handleChange">
        <el-option v-for="user in users" :key="user.id" :label="user.userDesc" :value="user.id" />
    </el-select>
</template>