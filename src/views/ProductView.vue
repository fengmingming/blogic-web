<script setup>
import {ref, onMounted, inject} from 'vue'
import {Product} from '../models/product'
import {User} from '../models/user'
import * as blogic from '../blogic'

const products = ref([])
const total = ref(0)
const queryForm = ref({
    types: [1],
    productName:'',
    pageSize:10,
    pageNum:1
})
const reload = inject('reload')
async function loadProducts() {
    if(queryForm.value.types.length > 1) {
        queryForm.value.types.shift()
    }
    let context = blogic.loadContext()
    let {types, ...queryParams} = {companyId: context.currentCompany.companyId, ... queryForm.value}
    if(types[0] == 2) {
        queryParams.createUserId = context.user.userId 
    }
    let productRes = await Product.find(queryParams)
    if(productRes?.code === 0){
        products.value = Product.toProduct(productRes.data.records)
        total.value = productRes.data.total
    }else {
        productRes?.showCodeDesc()
    }
}
function handleSizeChange(pageSize) {
    queryForm.value.pageSize = pageSize
    queryForm.value.pageNum = 1
    loadProducts()
}
function handleCurrentChange(pageNum) {
    queryForm.value.pageNum = pageNum
    loadProducts()
}
//新建产品
const productDialog = ref(false)
const richEditorKey = ref(1)
const emptyProduct = {
    id: null,
    productName:'',
    productDesc:'',
    userIds:[]
}
const users = ref([])
const productParam = ref(emptyProduct)
function productDialogShow() {
    productParam.value = emptyProduct
    richEditorKey.value++
    productDialog.value = true
}
async function productSubmitClick(submit) {
    productDialog.value = false
    if(submit) {
        let product = {...productParam.value}
        let res = null;
        if(product.id) {
            res = await Product.editProduct(product)
        }else {
            res = await Product.createProduct(product)
        }
        if(res?.code == 0) {
            blogic.showMessage('保存成功')
            reload()
        }else {
            res?.showCodeDesc()
        }
    }
}
function handleEditClick(product) {
    let {id, productName, productDesc} = {... product}
    productParam.value = {id, productName, productDesc}
    richEditorKey.value++
    productDialog.value = true
}
onMounted(() => {
    User.findAll().then(res => {
        if(res?.code == 0) {
            users.value = res.data
            loadProducts()
        }else {
            res?.showCodeDesc()
        }
    })
})
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
                            <el-checkbox-group v-model="queryForm.types" @change="loadProducts">
                                <el-checkbox-button :label="1">我参与的</el-checkbox-button>
                                <el-checkbox-button :label="2">我创建的</el-checkbox-button>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="产品名称">
                            <el-input clearable v-model="queryForm.productName" maxLength="254"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loadProducts">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" @click="productDialogShow">新建产品</el-button>
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
                        <template #="rowData">
                            <el-button type="primary" plain @click="handleEditClick(rowData.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="padding: 10px 10px;text-align: center;">
                    <el-pagination
                        v-model:current-page="queryForm.pageNum"
                        v-model:page-size="queryForm.pageSize"
                        :page-sizes="[10, 50, 100, 500]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        />
                </div>
            </div>
        </template>
    </MainContainer>
    <!-- 新增和编辑产品信息 -->
    <el-dialog v-model="productDialog" :key="richEditorKey">
        <el-form>
            <el-form-item label="产品名称">
                <el-input v-model="productParam.productName" />
            </el-form-item>
            <el-form-item label="参与人员">
                <el-select v-model="productParam.userIds" multiple>
                    <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="产品描述">
                <RichEditor v-model:content="productParam.productDesc"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="productSubmitClick(false)">关闭</el-button>
                <el-button type="primary" @click="productSubmitClick(true)">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>