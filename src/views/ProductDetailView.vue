<template>
    <MainContainer>
        <template #default>
            <el-form v-model="product" :key="flushKey">
                <el-form-item label="产品名称">
                    <el-text>{{ product.productName }}</el-text>
                </el-form-item>
                <el-form-item label="参与人员">
                    <el-text v-for="user in product.users">{{ user.name }}</el-text>
                </el-form-item>
                <el-form-item label="产品描述">
                    <RichEditor v-model:content="product.productDesc" :disabled="true" v-if="product.productDesc"/>
                </el-form-item>
            </el-form>
        </template>
    </MainContainer>
</template>
<script setup>
import {Product} from '../models/product'
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()
const params = router.currentRoute.value.params
const product = ref({})
const flushKey = ref(0)
onMounted(() => {
    Product.findById(params.id).then(res => {
        if(res?.code == 0) {
            product.value = Product.toProduct([res.data])[0]
            flushKey.value++
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>