<script setup>
import {ref, onMounted} from 'vue'
import {Product} from '../models/product'
import * as blogic from '../blogic'
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'

const products = ref([])
const pageNum = ref(1)
const pageSize = ref(20)
const queryForm = ref({
    types: [1],
    productName:''
})
onMounted(() => {
    loadProducts()
})
async function loadProducts() {
    if(queryForm.value.types.length > 1) {
        queryForm.value.types.shift()
    }
    let context = blogic.loadContext()
    let {types, ...queryParams} = {companyId: context.currentCompany.companyId, pageNum: pageNum.value, pageSize: pageSize.value, ... queryForm.value}
    if(types[0] == 2) {
        queryParams.createUserId = context.user.userId 
    }
    let productRes = await Product.find(queryParams)
    if(productRes?.code === 0){
        products.value = Product.toProduct(productRes.data)
    }else {
        productRes?.showCodeDesc()
    }
}
function changePageNum(arg) {
    pageNum.value = pageNum.value + arg
    if(pageNum.value <= 0) {
        pageNum.value = 1
    }
    loadProducts()
}
function queryBtnClick() {
    pageNum.value = 1
    loadProducts()
}
</script>
<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection :showProduct=false>
            </CompanyProductSelection>
        </template>
        <template #default>
            <el-row>
                <el-col :span="12">
                    <el-form :inline="true" v-model="queryForm">
                        <el-form-item>
                            <el-checkbox-group v-model="queryForm.types" @change="queryBtnClick">
                                <el-checkbox-button :label="1">我参与的</el-checkbox-button>
                                <el-checkbox-button :label="2">我创建的</el-checkbox-button>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="产品名称">
                            <el-input clearable v-model="queryForm.productName" maxLength="254"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="queryBtnClick">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary">新建产品</el-button>
                </el-col>
            </el-row>
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
                            <el-button type="primary" plain>编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: right;padding:10px 20px;">
                    <el-button :icon="ArrowLeft" @click="changePageNum(-1)">上一页</el-button>
                    <el-select v-model="pageSize" style="width: 100px;" @change="loadProducts">
                        <el-option v-for="item in blogic.pageSizeOptions" :key="item.value" :value="item.value" :label="item.label" />
                    </el-select>
                    <el-button :icon="ArrowRight" @click="changePageNum(1)">下一页</el-button>
                </div>
            </div>
        </template>
    </MainContainer>
    <el-dialog>
        <el-form>
            <el-form-item label="产品名称">
                <el-input />
            </el-form-item>
            <el-form-item label="产品描述">
                <el-input />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>