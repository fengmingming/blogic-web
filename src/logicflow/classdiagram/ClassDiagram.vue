<script>
import { LogicFlow } from '@logicflow/core'
import { Control, Menu, DndPanel, SelectionSelect } from '@logicflow/extension'
import "@logicflow/core/dist/style/index.css"
import '@logicflow/extension/lib/style/index.css'
import ClassDiagram from './classdiagram.js'

export default {
  data() {
    return {
      data:[]
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
    this.lf.openSelectionSelect()
    this.lf.register(ClassDiagram)
    lf.addMenuConfig({
      graphMenu: [{
        
          text: '分享',
          callback() {
            alert('分享成功！');
          }
        },
      ],
    })
    this.lf.on('node:dbclick', showClassDefinition)
    this.lf.render()
  },
  methods: {
    showClassDefinition(d, data, position, msg) {
    }
  }
}
</script>
<template>
    <div ref="container"></div>
</template>