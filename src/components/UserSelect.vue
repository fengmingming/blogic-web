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
    checkBox: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['update:modelValue'])
const datas = ref([])
const value = ref(props.modelValue)
const tree = ref()
function handleCheckChange() {
    let arr = []
    tree.value.getCheckedNodes().forEach(node => {
        if(node.leaf) {
            arr.push(node.id)
        }
    })
    emits('update:modelValue', arr)
}
onMounted(() => {
    User.findAll().then(res => {
        if(res?.code == 0) {
            datas.value = res.data
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>
<template>
    <el-tree-select ref="tree" node-key="id" v-model="value" :data="datas" :multiple="props.multiple" 
        :render-after-expand="true"  clearable :show-checkbox="props.checkBox" @check-change="handleCheckChange"/>
</template>