<script setup>
import {ref, onMounted, inject} from 'vue'
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
const reload = inject('reload')
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
        products.value = Product.toProduct(productRes.data.records)
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
function queryClick() {
    pageNum.value = 1
    loadProducts()
}
//新建产品
const addProductDialog = ref(false)
const newProductParam = ref({
    productName:'',
    productDesc:''
})
function addProductClick() {
    addProductDialog.value = true
}
async function addProductSubmitClick(submit) {
    addProductDialog.value = false
    if(submit) {
        let product = {...newProductParam.value}
        let res = await Product.createProduct(product)
        if(res?.code == 0) {
            blogic.showMessage('保存成功')
            reload()
        }else{
            res?.showCodeDesc()
        }
    }
}
const richEditorContent = ref('')
function richEditorBlur(content) {
    newProductParam.value.productDesc = content
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
                            <el-checkbox-group v-model="queryForm.types" @change="queryClick">
                                <el-checkbox-button :label="1">我参与的</el-checkbox-button>
                                <el-checkbox-button :label="2">我创建的</el-checkbox-button>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="产品名称">
                            <el-input clearable v-model="queryForm.productName" maxLength="254"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="queryClick">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" @click="addProductClick">新建产品</el-button>
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
    <el-dialog title="新建产品" v-model="addProductDialog">
        <el-form>
            <el-form-item label="产品名称">
                <el-input v-model="newProductParam.productName"/>
            </el-form-item>
            <el-form-item label="产品描述">
                <RichEditor :content="richEditorContent" @blur="richEditorBlur"/>
            </el-form-item>
        </el-form>
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addProductSubmitClick(false)">关闭</el-button>
                <el-button type="primary" @click="addProductSubmitClick(true)">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>