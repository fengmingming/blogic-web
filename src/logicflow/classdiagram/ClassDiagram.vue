<script>
import { LogicFlow } from '@logicflow/core'
import { Control, Menu, DndPanel, SelectionSelect } from '@logicflow/extension'
import "@logicflow/core/dist/style/index.css"
import '@logicflow/extension/lib/style/index.css'
import ClassDiagram from './classdiagram.js'

export default {
  data() {
    return {
      dialog: false,
      dialogKey: 0,
      classForm: {
        className: '',
        packageName: '',
        fields:[],
        methods:[]
      }
    }
  },
  mounted() {
    LogicFlow.use(Control)
    LogicFlow.use(Menu)
    LogicFlow.use(DndPanel)
    LogicFlow.use(SelectionSelect)
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: true,
      height: 800
    });
    const _lf = this.lf
    this.lf.openSelectionSelect()
    this.lf.register(ClassDiagram)
    this.lf.setMenuConfig({
      graphMenu: [],
      nodeMenu:[]
    })
    this.lf.setPatternItems([{
      type: 'classdiagram',
      label: '类图',
      properties: {classData: {
        className: 'new class',
        fields: [],
        methods: [],
      }},
      icon: 'data:image/png;base64,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'
    }])
    this.lf.on('node:dbclick', this.showClassDefinition)
    this.lf.render()
  },
  methods: {
    showClassDefinition(event) {
      let data = event.data
      let classData = data.properties.classData
      if(!classData.fields || classData.fields.length == 0) {
        classData.fields = [{name:'',type:''}]
      }
      if(!classData.methods || classData.methods.length == 0) {
        classData.methods = [{name:'',returnType:''}]
      }
      this.classForm = classData
      this.showDialog()
    },
    saveFun() {
      console.log(this.lf.getGraphRawData())
    },
    showDialog() {
      this.dialogKey++
      this.dialog = true
    },
    hideDialog() {
      this.dialog = false
    }
  },
  beforeDestroy() {
    this.lf.destroy();
  }
}
</script>
<template>
    <el-button @click="saveFun">保存</el-button>
    <div ref="container" style="padding-top: 10px"></div>
    <el-dialog :key="dialogKey" v-model="dialog">
      <el-form :model="classForm">
        <el-form-item label="包名：">
          <el-input v-model="classForm.packageName"/>
        </el-form-item>
        <el-form-item label="类名：">
          <el-input v-model="classForm.className"/>
        </el-form-item>
        <el-form-item label="属性：">
          <el-row style="width: 100%">
            <el-col :span="4">属性名</el-col><el-col :span="2">类型</el-col><el-col :span="18">描述</el-col>
          </el-row>
          <el-row v-for="field in classForm.fields" style="width: 100%">
            <el-col :span="4"><el-input v-model="field.name"/></el-col><el-col :span="2"><el-input v-model="field.type"/></el-col><el-col :span="18"><el-input v-model="field.desc"/></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="方法：" >
          <el-row style="width: 100%">
            <el-col :span="4">方法名</el-col><el-col :span="8">参数类型</el-col><el-col :span="2">返回类型</el-col><el-col :span="10">描述</el-col>
          </el-row>
          <el-row v-for="method in classForm.methods" style="width: 100%">
            <el-col :span="4"><el-input v-model="method.name"/></el-col>
            <el-col :span="8"></el-col>
            <el-col :span="2"><el-input v-model="method.returnType"/></el-col>
            <el-col :span="10"><el-input v-model="method.desc"/></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input type="textarea" v-model="classForm.desc"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary">保存</el-button>
      </template>
    </el-dialog>
</template>
<style>
.blogic_cd {
  background-color: bisque;
  width: 100%;
  max-width: 250px;
  border: 1px solid black;
  border-collapse:collapse;
}
.blogic_cd td {
  padding: 5px;
  border: 1px solid black;
  width: 100%;
  max-width: 250px;
}
</style>