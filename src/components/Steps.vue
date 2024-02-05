<template>
    <div style="width: 100%;text-align: center;" >
        <el-row v-for="step in steps" style="background-color: #FAFAFA;" align="middle" justify="center">
            <el-col :span="2" style="padding: 5px">
                {{ step.number }}
            </el-col>
            <el-col :span="10" style="padding: 5px">
                <el-text v-if="readOnly === true">{{ step.step }}</el-text>
                <el-input v-if="readOnly === false" type="textarea" v-model="step.step" @blur="handleBlurFun" :disabled="disabled"/>
            </el-col>
            <el-col :span="2" style="padding: 5px">
                期望结果
            </el-col>
            <el-col :span="9" style="padding: 5px">
                <el-text v-if="readOnly === true">{{ step.expectedResult }}</el-text>
                <el-input v-if="readOnly === false" type="textarea" v-model="step.expectedResult" @blur="handleBlurFun" :disabled="disabled"/> 
            </el-col>
            <el-col :span="1" style="padding: 5px">
                <el-dropdown v-if="!disabled && !readOnly">
                    <el-icon :size="20"><CirclePlus/></el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="nextStep(step)">下一步</el-dropdown-item>
                            <el-dropdown-item @click="delStep(step)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {CirclePlus} from '@element-plus/icons-vue'
import {Step} from '../models/step'

const props = defineProps({
    modelValue: {
        type: Array,
        default: [new Step({number: '1', step: '', expectedResult: ''})]
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readOnly: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:modelValue'])
const steps = ref(props.modelValue == null || props.modelValue.length == 0? [new Step({number: '1', step: '', expectedResult: ''})]: props.modelValue)
const disabled = ref(props.disabled)
const readOnly = ref(props.readOnly)
function indexOf(step) {
    return steps.value.indexOf(step)
}
function setNumber(arr) {
    let objs = []
    for(let i = 0,k = 0,j = arr.length;i < j;i++) {
        if(arr[i] === null) {
            continue
        }else {
            arr[i].number = (k++) + 1
            objs.push(arr[i])
        }
    }
    return objs
}
function nextStep(step) {
    let index = indexOf(step)
    steps.value.splice(index + 1, 0, {step: '', expectedResult: ''})
    steps.value = setNumber(steps.value)
}
function delStep(step) {
    if(steps.value.length > 1) {
        let index = indexOf(step)
        steps.value[index] = null
        steps.value = setNumber(steps.value)
    }
}
function handleBlurFun() {
    emits('update:modelValue', steps.value)
}
</script>