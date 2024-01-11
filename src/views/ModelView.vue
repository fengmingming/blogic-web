<script setup>
import ClassDiagram from '@/logicflow/classdiagram/ClassDiagram.vue'
</script>
<template>
    <MainContainer>
        <template #header>
          <CompanyProductSelection />
        </template>
        <template #default>
          <ClassDiagram />
        </template>
    </MainContainer>
</template>