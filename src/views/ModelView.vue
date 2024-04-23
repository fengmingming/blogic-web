<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import ClassDiagram from '@/logicflow/classdiagram/ClassDiagram.vue'

const router = useRouter()
const query = router.currentRoute.value.query
const modelId = ref(query.modelId?parseInt(query.modelId):null)
const readonly = ref(query.readonly?query.readonly:null)
</script>
<template>
    <MainContainer>
        <template #header>
          <CompanyProductSelection />
        </template>
        <template #default>
          <ClassDiagram :model-id="modelId" :readonly="readonly"/>
        </template>
    </MainContainer>
</template>