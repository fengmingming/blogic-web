<script setup>
import {ref, onMounted} from 'vue'
import {Dict} from '../models/dict'

const props = defineProps({
    dictType: {
        type: String,
        required: true
    },
    modelValue: {
        
    },
    multiple: {
        type: Boolean,
        default: false
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
const dictDatas = ref([])
const value = ref(typeof props.modelValue === 'string'?parseInt(props.modelValue):props.modelValue)
const disabled = ref(props.disabled)
const readOnly = ref(props.readOnly)
onMounted(() => {
    Dict.findByDictType(props.dictType).then(res => {
        if(res?.code == 0) {
            let datas = Dict.toDict(res.data)
            if(readOnly.value) {
                let dictMap = Dict.toMap(datas)
                if(Array.isArray(value.value)) {
                    let values = []
                    value.value.forEach(it => {
                        values.push(dictMap[it])
                    })
                    value.value = values
                }else {
                    value.value = dictMap[value.value]
                }
            }else {
                dictDatas.value = datas
            }
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
    <div v-if="readOnly === false">
        <el-select v-model="value" @change="handleChange" :multiple="props.multiple" clearable :disabled="disabled">
            <el-option v-for="data in dictDatas" :value="data.code" :label="data.codeDesc" :key="data.id"/>
        </el-select>
    </div>
    <div v-if="readOnly === true">
        <span v-if="Array.isArray(value)" v-for="v in value">{{ v }}</span>
        <span v-if="!Array.isArray(value)">{{ value }}</span>
    </div>
</template>
