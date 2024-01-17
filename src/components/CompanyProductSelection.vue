<script setup>
import {ref, onMounted, inject} from 'vue'
import { ArrowRight,ArrowDown } from '@element-plus/icons-vue'
import * as blogic from '../blogic'
import {Product} from '../models/product'
import {User} from '../models/user'

const props = defineProps({showProduct:{type: Boolean, default: true}})
const currentCompany = ref({})
const products = ref([])
const selectedProduct = ref({})
const reload = inject('reload')

function productDropDownSelected(product) {
    let context = blogic.loadContext()
    selectedProduct.value = product
    context.currentProduct = {productId: product.id, productName: product.productName}
    blogic.storeContext(context)
    User.saveDefProduct(product.id)
    reload()
}

onMounted(() => {
    let context = blogic.loadContext()
    currentCompany.value = context.currentCompany
    if(context.currentProduct) {
        selectedProduct.value = context.currentProduct
    }
    Product.findByCompanyId(context.currentCompany.companyId).then(res => {
        let productRes = blogic.handleResponse(res).records
        products.value = productRes
        if(productRes.length > 0 && context.currentProduct === null) {
            selectedProduct.value = productRes[0]
            context.currentProduct = {productId: productRes[0].id, productName: productRes[0].productName}
            blogic.storeContext(context)
            User.saveDefProduct(productRes[0].id)
        }
    })
})

</script>
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            {{ currentCompany.companyName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="products.length > 0 && props.showProduct">
            <el-dropdown trigger="click" @command="productDropDownSelected" max-height="500px">
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