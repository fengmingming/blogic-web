<template>
    <p>日志</p>
    <div v-for="record in records" style="padding-top:5px">
        <div><el-text>{{ record.operUserName }} {{ record.createTime }} {{ record.operDesc }}</el-text></div>
        <div style="padding-top:5px">
            <RichEditor v-if="record.note" :content="record.note" :disabled="true" :key="record.id"/>
        </div>
    </div>
</template>
<script setup>
import {onMounted, ref, defineProps} from 'vue'
import * as blogic from '../blogic'

const props = defineProps({
    keyType: {
        type: [Number, String],
        required: true
    },
    primaryKey: {
        type: [Number, String],
        required: true
    }
})
const records = ref([])
onMounted(() => {
    let companyId = blogic.getCurCompanyId()
    blogic.axios.get(`/Companies/${companyId}/ChangeRecords?keyType=${props.keyType}&primaryKey=${props.primaryKey}`).then(res => {
        if(res?.code == 0) {
            records.value = res.data
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>