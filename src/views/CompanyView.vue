<script setup>
import {ref, onMounted} from 'vue'
import * as blogic from '../blogic'
import CompanyPng from '../icons/company.png'
import { useRouter } from 'vue-router'
import {User, UserInvitation} from '../models/user'
import {Product} from '../models/product'
import {Dict} from '../models/dict'

const router = useRouter()
const companies = ref(blogic.loadContext().companies)
const disableClick = ref(true)
const disableClickMessage = ref('请选择公司')
const loading = ref(false)
async function clickMe(company) {
    blogic.handleResponse(await User.switchCompany(company.companyId))
    let context = blogic.loadContext()
    context.currentCompany = company
    let products = blogic.handleResponse(await Product.findByCompanyId(company.companyId)).records
    if(products.length > 0) {
        context.currentProduct = {productId: products[0].id, productName: products[0].productName}
    }
    blogic.storeContext(context)
    router.push('/home')
}
//我的邀请
const invitations = ref([])
function reject(userInvitationId) {
    UserInvitation.reject(userInvitationId).then(res => {
        if(res?.code == 0) {
            loadMyInvitations()
        }else {
            res?.showCodeDesc()
        }
    })
}
function accept(userInvitationId) {
    UserInvitation.accept(userInvitationId).then(res => {
        if(res?.code == 0) {
            blogic.showMessage('加入成功，请重新登录')
            loadMyInvitations()
        }else {
            res?.showCodeDesc()
        }
    })
}
async function loadMyInvitations() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('userinvitation_status')))
    UserInvitation.findMySelf().then(res => {
        if(res?.code == 0) {
            let datas = res.data
            datas.forEach(d => {
                d.statusName = statusDict[d.status]
            })
            invitations.value = datas
        }else {
            res?.showCodeDesc()
        }
    })
}
onMounted(() => {
    loadMyInvitations()
})
</script>
<template>
    <MainContainer :disableClick="disableClick" :disableClickMessage="disableClickMessage">
        <el-tabs :modelValue="'myCompanies'">
            <el-tab-pane label="我的公司" name="myCompanies">
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
            </el-tab-pane>
            <el-tab-pane label="我的邀请" name="myInvitations">
                <el-table :data="invitations" border style="width:100%;padding-top:10px">
                    <el-table-column prop="companyName" label="公司"/>
                    <el-table-column prop="departmentNames" label="部门" :formatter="(row) => row.departmentNames?.join(',')"/>
                    <el-table-column prop="roles" label="角色" />
                    <el-table-column prop="statusName" label="状态"/>
                    <el-table-column prop="createTime" label="发起时间"/>
                    <el-table-column label="操作">
                        <template #="rowData">
                            <el-popconfirm title="确定拒绝?" @confirm="reject(rowData.row.id)" v-if="rowData.row.status == 10">
                                <template #reference>
                                    <el-button :text="true">拒绝</el-button>
                                </template>
                            </el-popconfirm>
                            <el-popconfirm title="确定同意?" @confirm="accept(rowData.row.id)" v-if="rowData.row.status == 10">
                                <template #reference>
                                    <el-button type="primary" :text="true">同意</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </MainContainer>
</template>