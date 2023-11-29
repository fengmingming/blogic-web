<script setup>
import {ref} from 'vue'
import { ArrowRight,ArrowDown } from '@element-plus/icons-vue'
import * as blogic from '../blogic'
import {Product} from '../models/project'

const context = blogic.loadContext()
const currentCompany = ref(context.currentCompany)

async function companyDropDownSelected(company) {
    currentCompany.value = company
    context.currentCompany = company
    let resPromise = await blogic.axios.get('/Companies/' + company.companyId)
    console.log(resPromise)
}

</script>
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            <el-dropdown trigger="click" @command="companyDropDownSelected">
                <span class="el-dropdown-link">
                    {{ currentCompany.companyName }}
                    <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu v-for="company in context.companies">
                        <el-dropdown-item :command="company">{{ company.companyName }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-breadcrumb-item>

        <slot>
        </slot>
    </el-breadcrumb>
</template>