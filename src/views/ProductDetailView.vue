<template>
    <el-form v-model="product">
        <el-from-item label="产品名称">
            <el-text>{{ product.productName }}</el-text>
        </el-from-item>
        <el-from-item label="参与人员">
            
        </el-from-item>
        <el-from-item label="产品描述">
            <el-text>{{ product.productName }}</el-text>
        </el-from-item>
    </el-form>
</template>
<script setup>
import {Product} from '../models/product'
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()
const product = ref({})
onMounted(() => {
    Product.findById(router.params.id).then(res => {
        if(res?.code == 0) {
            product.value = Product.toProduct([res.data])[0]
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>