<template>
    <MainContainer>
        <template #header>
            <CompanyProductSelection :showProduct="false">
            </CompanyProductSelection>
        </template>
        <template #default>
            <el-tabs :modelValue="'members'">
                <el-tab-pane label="人员" name="members">
                    <el-table :data="users" border style="width:100%">
                        <el-table-column prop="phone" label="手机号" />
                        <el-table-column prop="name" label="姓名" />
                        <el-table-column prop="departmentNames" label="部门" />
                        <el-table-column prop="roleNames" label="角色" />
                        <el-table-column prop="joinTime" label="加入时间" />
                        <el-table-column label="操作" fixed="right" width="200px">
                            <template #="rowData">
                                <el-button @click="editUser(rowData.row)">编辑</el-button>
                                <el-button @click="removeUser(rowData.row)" v-if="!rowData.row.admin">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="部门" name="departments">
                    
                </el-tab-pane>
                <el-tab-pane label="已发出的邀请" name="sendedInvitations">

                </el-tab-pane>
            </el-tabs>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {User} from '../models/user'
// 人员
const users = ref([])
function removeUser(user) {//移除用户与公司的绑定关系，超级管理员无法移除

}
function editUser(user) {
    
}

// 部门

// 邀请


onMounted(() => {
    User.findAll().then(res => {
        if(res?.code == 0) {
            let datas = User.toUsers(res.data)
            datas.forEach(data => {
                data.roleNames = data.roles?.map(role => role.role)
                data.departmentNames = data.departmentNames?.map(department => department.departmentName)
                data.admin = data.roles?.map(role => role.admin).filter(admin => admin == 1).length > 0
            })
            users.value = datas
        }else {
            res?.showCodeDesc()
        }
    })
})
</script>