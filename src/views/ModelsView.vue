<script setup>
import {ref, onMounted} from 'vue'
import {Model} from '../models/Model'

const models = ref([])
onMounted(() => {
    Model.findList({}).then(res => {
        if(res?.code == 0) {
            models.value = res.data
        }else {
            res?.showCodeDesc()
        }
    })
})
function handleClose(id) {

}
function handleClick(id) {

}
</script>
<template>
    <MainContainer>
        <template #header>
          <CompanyProductSelection />
        </template>
        <template #default>
          <div>
            <el-tag v-for="model in models" :key="model.id" closable :disable-transitions="false" @close="handleClose(model.id)" @click="handleClick(model.id)">
                {{ model.name }}
            </el-tag>
          </div>
        </template>
    </MainContainer>
</template>