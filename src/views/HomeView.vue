<script setup>
import HomeMyView from './HomeMyView.vue'
import HomeOwnerView from './HomeOwnerView.vue'
</script>
<template>
  <MainContainer>
    <template #header>
      <CompanyProductSelection :showProduct="false"/>
    </template>
    <el-tabs type="border-card">
      <el-tab-pane label="我负责的">
        <HomeOwnerView />
      </el-tab-pane>
      <el-tab-pane label="我创建的">
        <HomeMyView />
      </el-tab-pane>
    </el-tabs>
  </MainContainer>
</template>
