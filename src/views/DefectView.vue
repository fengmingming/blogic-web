<script setup>
import TestCase from './TestCaseView.vue'
import Bug from './BugView.vue'

</script>
<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection />
        </template>
        <template #default>
            <el-tabs>
                <el-tab-pane label="测试用例">
                    <TestCase />
                </el-tab-pane>
                <el-tab-pane label="缺陷">
                    <Bug />
                </el-tab-pane>
            </el-tabs>
        </template>
    </MainContainer>
</template>