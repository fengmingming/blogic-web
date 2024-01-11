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
                    <el-row>
                        <el-col :span="20">
                        </el-col>
                        <el-col :span="4" style="text-align: right;">
                            <el-button type="primary" @click="handleAddDepartmentClick">新建部门</el-button>
                        </el-col>
                    </el-row>
                    <el-tree :data="treeData" node-key="id" :props="treeProps" @node-contextmenu="handleTreeNodeClick" :default-expanded-keys="defaultExpandedKeys"/>
                    <el-dialog v-model="deptDialog" :key="deptDialogKey" width="30%">
                        <el-form :model="department" ref="departmentRef" :rules="departmentRules" label-width="100px">
                            <el-form-item label="部门名称" prop="departmentName">
                                <el-input v-model="department.departmentName"/>
                            </el-form-item>
                            <el-form-item label="上级部门">
                                <el-select v-model="department.parentId" :filterable="true" :clearable="true">
                                    <el-option v-for="dept in departmentSelectData" :key="dept.id" :label="dept.departmentName" :value="dept.id"/>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <el-button @click="handleSaveDeptClick(false)">关闭</el-button>
                            <el-button type="primary" @click="handleSaveDeptClick(true)">保存</el-button>
                        </template>
                    </el-dialog>
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
import {Department} from '../models/department'
// 人员
const users = ref([])
function removeUser(user) {//移除用户与公司的绑定关系，超级管理员无法移除

}
function editUser(user) {
    
}

// 部门
const treeData = ref([])
const defaultExpandedKeys = ref([])
const treeProps = {
    label: 'departmentName',
    children: 'children',
}
function loadTreeData() {
    Department.findAll().then(res => {
        if(res?.code == 0) {
            departments.value = res.data
            departmentSelectData.value = res.data
            defaultExpandedKeys.value = res.data?.map(d => d.id)
            console.log(defaultExpandedKeys.value)
            treeData.value = Department.buildTree(res.data)
        }else {
            res?.showCodeDesc()
        }
    })
}
function handleTreeNodeClick(e, data) {
    department.value = {... data}
    departmentSelectData.value = departments.value.filter(it => it.id != data.id)
    showDeptDialog()
}
function handleAddDepartmentClick() {
    department.value = {... emptyDepartment}
    departmentSelectData.value = departments.value
    showDeptDialog()
}
const deptDialog = ref(false)
const deptDialogKey = ref(0)
function showDeptDialog() {
    deptDialog.value = true
    deptDialogKey.value++
}
function hideDeptDialog() {
    deptDialog.value = false
}
const emptyDepartment = {
    id: null,
    departmentName: '',
    parentId: null,
}
const department = ref(emptyDepartment)
const departmentRules = ref({
    departmentName:[{
        required: true, message:'',trigger:'blur'
    },{
        min: 1, max: 200, messge:'1-200字', trigger:'blur'
    }]
})
const departmentRef = ref()
const departments = ref([])
const departmentSelectData = ref([])
function handleSaveDeptClick(submit) {
    if(submit) {
        departmentRef.value.validate((valid, fields) => {
            if(valid) {
                Department.save(department.value).then(res => {
                    if(res?.code == 0) {
                        loadTreeData()
                        hideDeptDialog()
                    }else {
                        res?.showCodeDesc()
                    }
                })
            }
        })
    }else {
        hideDeptDialog()
    }
}
// 邀请


onMounted(() => {
    User.findAll().then(res => {
        if(res?.code == 0) {
            let datas = User.toUsers(res.data)
            datas.forEach(data => {
                data.roleNames = data.roles.join(',')
                data.departmentNames = data.departments?.join(',')
            })
            users.value = datas
        }else {
            res?.showCodeDesc()
        }
    })
    loadTreeData()
})
</script>