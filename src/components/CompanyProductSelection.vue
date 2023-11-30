<script setup>
import {ref, onMounted} from 'vue'
import { ArrowRight,ArrowDown } from '@element-plus/icons-vue'
import * as blogic from '../blogic'
import {Product} from '../models/project'
import {User} from '../models/user'

const companies = ref([])
const selectedCompany = ref({})
const products = ref([])
const selectedProduct = ref({})

async function companyDropDownSelected(company) {
    selectedCompany.value = company
    await User.switchCompany(company.companyId)
    console.log(2)
    let context = blogic.loadContext()
    context.currentCompany = company
    blogic.storeContext(context)
    console.log(21)
    let productRes = await Product.findByCompanyId(company.companyId);
    console.log(productRes)
    console.log(22)
    products.value = productRes
    if(products.length > 0)
        selectedProduct = productRes[0]
}

onMounted(() => {
    let context = blogic.loadContext()
    companies.value = context.companies
    companyDropDownSelected(context.currentCompany)
})

</script>
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            <el-dropdown trigger="click" @command="companyDropDownSelected">
                <span class="el-dropdown-link">
                    {{ selectedCompany.companyName }}
                    <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu v-for="company in companies">
                        <el-dropdown-item :command="company">{{ company.companyName }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="products.length > 0">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    {{ selectedProduct.productName }}
                    <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu v-for="product in products">
                        <el-dropdown-item :command="product">{{ product.productName }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-breadcrumb-item>
        <slot>
        </slot>
    </el-breadcrumb>
</template>