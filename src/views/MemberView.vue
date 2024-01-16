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
                    <el-dialog  v-model="userDialog" :key="userDialogKey" width="30%">
                        <el-form :model="user" ref="userRef" :rules="userRules">
                            <el-form-item label="部门:" prop="departmentIds">
                                <el-select v-model="user.departmentIds" :multiple="true" :clearable="true" :filterable="true" style="width:100%">
                                    <el-option v-for="department in departments" :value="department.id" :key="department.id" :label="department.departmentName"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="角色:" prop="roles">
                                <el-select v-model="user.roles" :multiple="true" style="width:100%">
                                    <el-option v-for="role in roles" :value="role" :key="role" :label="role"/>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <el-button @click="handleSaveUserClick(false)">关闭</el-button>
                            <el-button type="primary" @click="handleSaveUserClick(true)">保存</el-button>
                        </template>
                    </el-dialog>
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
                    <el-row><el-col :span="22"/><el-col :span="2"><el-button type="primary" @click="showInvitationDialog">发起邀请</el-button></el-col></el-row>
                    <el-table :data="userInvitations" border style="width:100%;padding-top:10px">
                        <el-table-column prop="phone" label="手机号"/>
                        <el-table-column prop="departmentNames" label="部门" :formatter="(row) => row.departmentNames?.join(',')"/>
                        <el-table-column prop="roles" label="角色" />
                        <el-table-column prop="statusName" label="状态"/>
                        <el-table-column prop="createTime" label="发起时间"/>
                        <el-table-column label="操作">
                            <template #="rowData">
                                <el-popconfirm title="确定撤销?" @confirm="cancelInvitation(rowData.row.id)">
                                    <template #reference>
                                        <el-button type="primary" :text="true">撤销</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog v-model="invitationDialog" :key="invitationDialogKey" style="width: 500px">
                        <el-form :model="userInvitationForm" :rules="userInvitationRules" ref="userInvitationFormRef" label-width="70px">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="userInvitationForm.phone"/>
                            </el-form-item>
                            <el-form-item label="角色" prop="roles">
                                <el-select v-model="userInvitationForm.roles" :multiple="true" style="width:100%">
                                    <el-option v-for="role in roles" :value="role" :key="role" :label="role"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="部门" prop="departmentIds">
                                <el-select v-model="userInvitationForm.departmentIds" :multiple="true" :clearable="true" :filterable="true" style="width:100%">
                                    <el-option v-for="department in departments" :value="department.id" :key="department.id" :label="department.departmentName"/>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <el-button @click="hideInvitationDialog">关闭</el-button>
                            <el-button type="primary" @click="invitationSubmit()">提交</el-button>
                        </template>
                    </el-dialog>
                </el-tab-pane>
            </el-tabs>
        </template>
    </MainContainer>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {User, UserInvitation} from '../models/user'
import {Department} from '../models/department'
import {Dict} from '../models/dict'
import * as blogic from '../blogic'

// 人员
const users = ref([])
const roles = ref(['ROLE_MANAGER','ROLE_PM','ROLE_DEVELOPER','ROLE_TESTER'])
function loadUsers() {
    User.findAll().then(res => {
        if(res?.code == 0) {
            let datas = User.toUsers(res.data)
            datas.forEach(data => {
                data.roleNames = data.roles.join(',')
                data.departmentNames = data.departments?.map(d => d.departmentName).join(',')
            })
            users.value = datas
        }else {
            res?.showCodeDesc()
        }
    })
}
const user = ref({
    departmentIds: null,
    roles: null
})
const userRef = ref()
const userRules = ref({
    departmentIds: [{
        required: true, message:'', trigger: 'blur'
    }],
    roles: [{
        required: true, message:'', trigger: 'blur'
    }]
})
const userDialog = ref(false)
const userDialogKey = ref(0)
function showUserDialog() {
    userDialogKey.value++
    userDialog.value = true
}
function hideUserDialog() {
    userDialog.value = false
}
function removeUser(userData) {

}
function editUser(userData) {
    let {id, roles}  = userData
    let departmentIds = userData.departments?.map(d => d.id)
    user.value = {id, departmentIds, roles}
    showUserDialog()
}
function handleSaveUserClick(submit) {
    if(submit) {
        userRef.value.validate((valid, fields) => {
            if(valid) {
                User.updateCompanyInfo(user.value).then(res => {
                    if(res?.code == 0) {
                        loadUsers()
                        hideUserDialog()
                    }else {
                        res?.showCodeDesc()
                    }
                })
            }
        })
    }else {
        hideUserDialog()
    }
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
            defaultExpandedKeys.value = res.data?.map(d => d.id)
            treeData.value = Department.buildTree(res.data)
            departments.value = Department.buildSelectData(treeData.value)
            departmentSelectData.value = departments.value
        }else {
            res?.showCodeDesc()
        }
    })
}
function handleTreeNodeClick(e, data) {
    department.value = {... data}
    let excludeIds = []
    departmentSelectData.value = departments.value.filter(it => {
        if(it.id == data.id) {
            excludeIds.push(data.id)
            return false
        }
        if(excludeIds.indexOf(it.parentId) >= 0) {
            excludeIds.push(it.id)
            return false
        }else {
            return true
        }
    })
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
const userInvitations = ref([])
const invitationDialog = ref(false)
const invitationDialogKey = ref(0)
function showInvitationDialog() {
    invitationDialogKey.value++
    invitationDialog.value = true
}
function hideInvitationDialog() {
    invitationDialog.value = false
}
async function loadUserInvitations() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('userinvitation_status')))
    let res = await UserInvitation.findAll()
    if(res?.code == 0) {
        let datas = res.data
        datas.forEach(d => {
            d.statusName = statusDict[d.status]
        })
        userInvitations.value = datas
    }else {
        res?.showCodeDesc()
    }
}
const emptyUserInvitation = {
    phone: '',
    roles: [],
    departmentIds: []
}
const userInvitationForm = ref({... emptyUserInvitation})
const userInvitationFormRef = ref()
const userInvitationRules = ref({
    phone: [{
        required: true, message: '', trigger: 'blur'
    }, {
        min: 11, max: 11, message: '', trigger: 'blur'
    }],
    roles: [{
        required: true, message: '', trigger: 'blur'
    }],
    departmentIds: [{
        validator: (rule, value, callback) => {
            if(value) {
                if(value.length > 5) {
                    callback(new Error('最多选择5个部门'))
                    return
                }
            }
            callback()
        }
    }]
})
function handleInvitationClick() {
    userInvitationForm.value = {... emptyUserInvitation}
    showInvitationDialog()
}
function invitationSubmit() {
    userInvitationFormRef.value.validate((valid, fields) => {
        if(valid) {
            UserInvitation.save(userInvitationForm.value).then(res => {
                if(res?.code == 0) {
                    blogic.showMessage("邀约成功，等待对方同意")
                    hideInvitationDialog()
                }else {
                    res?.showCodeDesc()
                }
            })
        }
    })
}
function cancelInvitation(userInvitationId) {
    alert('撤销')
}
onMounted(() => {
    loadUsers()
    loadTreeData()
    loadUserInvitations()
})
</script>