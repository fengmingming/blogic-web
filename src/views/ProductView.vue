<script setup>
import {ref, onMounted} from 'vue'
import {Product} from '../models/product'
import * as blogic from '../blogic'

const products = ref([])
onMounted(() => {
    loadProducts()
})
async function loadProducts() {
    let context = blogic.loadContext()
    let productRes = await Product.findByCompanyId(context.currentCompany.companyId, 1, 10)
    if(productRes?.code === 0){
        products.value = Product.toProduct(productRes.data)
    }else {
        productRes?.showCodeDesc()
    }
}
</script>
<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection :showProduct=false>
            </CompanyProductSelection>
        </template>
        <template #default>
            <div>
                <el-button plain>我参与的</el-button>
                <el-button plain>我创建的</el-button>
            </div>
            <div>

            </div>
            <div style="padding-top: 20px">
                <el-table :data="products" border style="width: 100%">
                    <el-table-column prop="id" label="产品id"/>
                    <el-table-column prop="productName" label="产品名称"/>
                    <el-table-column prop="createUserName" label="由谁创建" />
                    <el-table-column prop="createTime" label="创建时间" />
                    <el-table-column prop="updateTime" label="修改时间" />
                    <el-table-column prop="id" label="操作">
                        <template #default>
                            <el-button text>编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </MainContainer>
</template>