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
    }
})
const emits = defineEmits(['update:modelValue'])
const users = ref([])
const value = ref(props.modelValue)
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
            users.value = res.data
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>
<template>
    <el-select v-model="value" filterable>
        <el-option v-for="user in users" :key="user.id" :label="user.userDesc" :value="user.id" @change="handleChange"/>
  </el-select>
</template>