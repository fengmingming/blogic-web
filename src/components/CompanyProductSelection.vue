<script setup>
import {ref, onMounted} from 'vue'
import { ArrowRight,ArrowDown } from '@element-plus/icons-vue'
import * as blogic from '../blogic'
import {Product} from '../models/product'
import {User} from '../models/user'
import {useRouter} from 'vue-router'


const props = defineProps({showProduct:{type: Boolean, default: true}})
const companies = ref([])
const selectedCompany = ref({})
const products = ref([])
const selectedProduct = ref({})
const router = useRouter()

async function companyDropDownSelected(company) {
    selectedCompany.value = company
    blogic.handleResponse(await User.switchCompany(company.companyId))
    let context = blogic.loadContext()
    context.currentCompany = company
    context.currentProduct = null
    blogic.storeContext(context)
    selectedProduct.value = {}
    let productRes = blogic.handleResponse(await Product.findByCompanyId(company.companyId, 1, 1000))
    products.value = productRes
    if(productRes.length > 0) {
        selectedProduct.value = productRes[0]
        context.currentProduct = {productId: productRes[0].id, productName: productRes[0].productName}
        blogic.storeContext(context)
    }
    router.go(0)
}

function productDropDownSelected(product) {
    let context = blogic.loadContext()
    selectedProduct.value = product
    context.currentProduct = {productId: product.id, productName: product.productName}
    blogic.storeContext(context)
}

onMounted(() => {
    let context = blogic.loadContext()
    companies.value = context.companies
    selectedCompany.value = context.currentCompany
    if(context.currentProduct) {
        selectedProduct.value = context.currentProduct
    }
    Product.findByCompanyId(context.currentCompany.companyId).then(res => {
        let productRes = blogic.handleResponse(res)
        products.value = productRes
        if(productRes.length > 0 && context.currentProduct === null) {
            selectedProduct.value = productRes[0]
            context.currentProduct = {productId: productRes[0].id, productName: productRes[0].productName}
            blogic.storeContext(context)
        }
    })
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
        <el-breadcrumb-item v-if="products.length > 0 && props.showProduct">
            <el-dropdown trigger="click" @command="productDropDownSelected">
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