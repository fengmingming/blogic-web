<template>
<el-tabs v-model="activeTab" @tab-change="handleTabChange">
    <el-tab-pane label="产品" v-if="blogic.hasRole('ROLE_PM')" name="product">
        <el-table :data="products" border style="width: 100%">
            <el-table-column prop="id" label="产品id" width="100px"/>
            <el-table-column prop="productName" label="产品名称"/>
            <el-table-column prop="createUserName" label="由谁创建" width="200px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column prop="updateTime" label="修改时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #="rowData">
                    <el-button type="primary" text @click="router.push(`/product/${rowData.row.id}`)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="productTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="需求" v-if="blogic.hasRole('ROLE_PM')" name="requirement">
        <el-table :data="requirements" border style="width: 100%">
            <el-table-column prop="id" label="需求id" width="100px"/>
            <el-table-column prop="requirementName" label="需求名称" />
            <el-table-column prop="requirementSources" label="需求来源" width="200px"/>
            <el-table-column prop="requirementStatus" label="需求状态" width="150px"/>
            <el-table-column prop="createUserName" label="创建人" width="200px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column prop="updateTime" label="修改时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #="rowData">
                    <el-button type="primary" text @click="router.push(`/requirement/${rowData.row.id}`)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="requirementTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="迭代" v-if="blogic.hasRole('ROLE_PM', 'ROLE_DEVELOPER', 'ROLE_TESTER')" name="iteration">
        <el-table :data="iterations" border style="width: 100%">
            <el-table-column prop="id" label="迭代id" width="100px"/>
            <el-table-column prop="name" label="迭代名称"/>
            <el-table-column prop="versionCode" label="迭代版本" width="200px"/>
            <el-table-column prop="scheduledStartTime" label="开始时间" width="200px"/>
            <el-table-column prop="scheduledEndTime" label="结束时间" width="200px"/>
            <el-table-column prop="status" label="状态" width="100px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column prop="updateTime" label="最后修改时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #="rowData">
                    <el-button type="primary" @click="router.push(`/iteration/${rowData.row.id}`)" text>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="iterationTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="任务" name="task">
        <el-table :data="tasks" border style="width: 100%">
            <el-table-column label="任务id" prop="id" width="100px"/>
            <el-table-column label="任务名称" prop="taskName"/>
            <el-table-column label="任务状态" prop="statusName" width="100px"/>
            <el-table-column label="创建人" prop="createUserName" width="200px"/>
            <el-table-column label="创建时间" prop="createTime" width="200px"/>
            <el-table-column #="rowData" label="操作" width="100px">
                <el-button type="primary" @click="router.push(`/task/${rowData.row.id}`)" text>查看</el-button>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="taskTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="用例" v-if="blogic.hasRole('ROLE_TESTER')" name="testcase">
        <el-table :data="testcases" border style="width:100%">
            <el-table-column prop="id" label="用例id" width="100px"/>
            <el-table-column prop="title" label="用例标题"/>
            <el-table-column prop="priority" label="优先级" width="100px"/>
            <el-table-column prop="ownerUserName" label="负责人" width="150px"/>
            <el-table-column prop="smoke" label="是否冒烟" :formatter="(row, column, cellValue, index) => cellValue?'是':'否'" width="100px"/>
            <el-table-column prop="status" label="状态" width="100px"/>
            <el-table-column prop="createUserName" label="创建人" width="150px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #=rowData>
                    <el-button type="primary" @click="router.push(`/testCase/${rowData.row.id}`)" text>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="testcaseTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
    <el-tab-pane label="缺陷" name="bug">
        <el-table :data="bugs" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100px"/>
            <el-table-column prop="severity" label="级别" width="50px"/>
            <el-table-column prop="priority" label="优先级" width="50px"/>
            <el-table-column prop="title" label="Bug标题"/>
            <el-table-column prop="statusName" label="状态" width="100px"/>
            <el-table-column prop="fixUserName" label="解决人" width="150px"/>
            <el-table-column prop="fixSolutionName" label="解决方案" width="150px"/>
            <el-table-column prop="createUserName" label="创建人" width="150px"/>
            <el-table-column prop="createTime" label="创建时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="100px">
                <template #="rowData">
                    <el-button type="primary" @click="router.push(`/bug/${rowData.row.id}`)" text>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="padding-top: 20px" v-model:current-page="pageNum" v-model:page-size="pageSize" 
            :page-sizes="[10, 50, 100, 500]" layout="total, sizes, prev, pager, next, jumper"
            :total="bugTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-tab-pane>
</el-tabs>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import * as blogic from '../blogic'
import {Task} from '../models/task'
import {Bug} from '../models/Bug'
import {Dict} from '../models/Dict'
import {TestCase} from '../models/testcase'
import {Product} from '../models/product'
import {Requirement} from '../models/requirement'
import {Iteration} from '../models/iteration' 

const router = useRouter()
const activeTab = ref('task')
const userId = blogic.loadContext().user.userId
const pageSize = ref(10)
const pageNum = ref(1)
function handleSizeChange(size) {
  pageSize.value = size
  handleTabChange(activeTab.value)
}
function handleCurrentChange(num) {
  pageNum.value = num
  handleTabChange(activeTab.value)
}
//任务
const taskTotal = ref(0)
const tasks = ref([])
async function loadTask() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('task_status')))
    let res = await Task.findList({createUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    if(res?.code == 0) {
        taskTotal.value = res.data.total
        let objs = Task.toTask(res.data.records)
        objs.forEach(obj => {
            obj.statusName = statusDict[obj.status]
        })
        tasks.value = objs
    }else {
        res?.showCodeDesc()
    }
}
//缺陷
const bugs = ref([])
const bugTotal = ref(0)
async function loadBug() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('bug_status')))
    let res = await Bug.findList({createUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    if(res?.code == 0) {
        let datas = Bug.toBug(res.data.records)
        datas.forEach(data => {
            data.statusName = statusDict[data.status]
        })
        bugs.value = datas
        bugTotal.value = res.data.total
    }else {
        res?.showCodeDesc()
    }
}
//用例
const testcaseTotal = ref(0)
const testcases = ref([])
async function loadTestCase() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('testcase_status')))
    let res = await TestCase.findList({createUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    if(res?.code == 0) {
        res.data.records.forEach(it => {
            it.status = statusDict[it.status]
        })
        testcaseTotal.value = res.data.total
        testcases.value = res.data.records
    }else {
        res?.showCodeDesc()
    }
}
//产品
const products = ref([])
const productTotal = ref(0)
async function loadProducts() {
    let context = blogic.loadContext()
    let companyId = context.currentCompany.companyId
    let productRes = await Product.find({companyId: companyId, createUserId: userId, pageSize:pageSize.value, pageNum: pageNum.value})
    if(productRes?.code === 0) {
        products.value = Product.toProduct(productRes.data.records)
        productTotal.value = productRes.data.total
    }else {
        productRes?.showCodeDesc()
    }
}
//需求
const requirements = ref([])
const requirementTotal = ref(0)
async function loadRequirement() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('requirement_status')))
    let res = await Requirement.findList({createUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value})
    res = blogic.handleResponse(res)
    res.records.forEach(a => {
        a.requirementStatus = statusDict[a.requirementStatus]
    })
    requirements.value = res.records
    requirementTotal.value = res.total
}
//迭代
const iterations = ref([])
const iterationTotal = ref(0)
async function loadIteration() {
    let statusDict = Dict.toMap(blogic.handleResponse(await Dict.findByDictType('iteration_status')))
    let res = blogic.handleResponse(await Iteration.findList({createUserId: userId, pageSize: pageSize.value, pageNum: pageNum.value}))
    res.records.forEach(it => {
        it.status = statusDict[it.status]
    })
    iterations.value = res.records
    iterationTotal.value = res.total
}
//
onMounted(() => {
    loadTask()
})
function handleTabChange(tabName) {
    switch (tabName) {
        case 'product':
            loadProducts()
            break
        case 'requirement':
            loadRequirement()
            break
        case 'iteration':
            loadIteration()
            break
        case 'task':
            loadTask()
            break
        case 'bug':
            loadBug()
            break
        case 'testcase':
            loadTestCase()
            break
    }
    activeTab.value = tabName
}
</script>