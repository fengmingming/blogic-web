<script setup>
import {ref} from 'vue'
import * as blogic from '../blogic'
import CompanyPng from '../icons/company.png'
import { useRouter } from 'vue-router'
import {User} from '../models/User'

const router = useRouter()
const companies = ref(blogic.loadContext().companies)
const disableClick = ref(true)
const disableClickMessage = ref('请选择公司')
const loading = ref(false)
async function clickMe(company) {
    blogic.handleResponse(await User.switchCompany(company.companyId))
    let context = blogic.loadContext()
    context.currentCompany = company
    context.currentProduct = null
    blogic.storeContext(context)
    router.push('/home')
}
</script>
<template>
    <MainContainer :disableClick="disableClick" :disableClickMessage="disableClickMessage">
        <el-space direction="vertical" alignment="flex-start">
            <el-skeleton :loading="loading" animated :count="companies.length">
                <template #template>
                    <el-skeleton-item variant="image" />
                        <div style="padding: 14px">
                            <el-skeleton-item variant="h3" />
                            <div style="display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
                            <el-skeleton-item variant="text" style="margin-right: 16px" />
                            <el-skeleton-item variant="text" />
                        </div>
                    </div>
                </template>
                <template #default>
                    <el-card v-for="company in companies" :key="company.companyId" :body-style="{ padding: '10px', marginBottom: '1px', textAlign: 'center'}">
                        <img :src="company.imgUrl?company.imgUrl:CompanyPng" style="width:200px;padding:10px"/>
                        <div style="padding: 10px;">
                            <div style="padding-top:10px">
                                <el-button type="primary" round @click="clickMe(company)">{{ company.companyName }}</el-button>
                            </div>
                        </div>
                    </el-card>
                </template>
            </el-skeleton>
        </el-space>
    </MainContainer>
</template>