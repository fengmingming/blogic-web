<script>
import { LogicFlow } from '@logicflow/core'
import { Control, Menu, DndPanel, SelectionSelect} from '@logicflow/extension'
import "@logicflow/core/dist/style/index.css"
import '@logicflow/extension/lib/style/index.css'
import ClassDiagram from './classdiagram.js'
import PkgDiagram from './package.js'
import InterfaceDiagram from './interface.js'
import CommentDiagram from './comment.js'
import EnumDiagram from './enum.js'
import {Model} from '../../models/model.js'
import * as blogic from '../../blogic'

export default {
  props: {
    modelId: Number,
    silentMode: Boolean
  },
  data() {
    return {
      modelName: '',
      data: {nodes:[], edges: []}
    }
  },
  mounted() {
    let _this = this
    LogicFlow.use(Control)
    LogicFlow.use(Menu)
    LogicFlow.use(DndPanel)
    LogicFlow.use(SelectionSelect)
    _this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: true,
      height: 800,
      stopScrollGraph: true,
      stopZoomGraph: true,
      allowRotation: true
    });
    let _lf = _this.lf
    _this.lf.openSelectionSelect()
    _this.lf.register(ClassDiagram)
    _this.lf.register(PkgDiagram)
    _this.lf.register(InterfaceDiagram)
    _this.lf.register(EnumDiagram)
    _this.lf.register(CommentDiagram)
    let patternItems = [{
      type: 'packagediagram',
      label: 'package',
      properties: {
        data: {
          packageName: null
      }},
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAaCAYAAADfcP5FAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEwSURBVEhLY/wPBAyDCDBB6UED4CHU3NHDICYqwvD/H5UCjJGB4c/vPwx8/HwMcVHhUEEiAMhBIDBlxhwoi7pgKonmwqMMyIayqAsiwoIY1qzfCOURBnAHsTAzQ1nUBUKCggxPn72A8ggDeBoqKq9h8PP2YPj58ydYglqAg4ODYdHSFQwxwHT06+cvoAgiJkAsJkZGBjcXJ4gAEMAd1Nk7kSEzLYnh+/fvYAlqApCjfvwAeRQ1WTACHfMD6MhNW7Yz5GSkQARBDgIBWiVqYsCkabOgLDokamIAKKRgYNAVjKMOIgRGHUQIjDqIEBh1ECEw6iBCYJA4CFGPwh00kJXrb2DbGwbg7aHZ8xcx/PnzB9g2R9S8NAdAq75++8bg6mjPoKerAxGCOWiwgEGWqBkYABEgdRHxIQdtAAAAAElFTkSuQmCC'
    },{
      type: 'classdiagram',
      label: 'class',
      properties: {
        data: {
          className: null,
          fields:[],
          methods:[]
      }},
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAZCAYAAABZ5IzrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAD5SURBVEhLY/wPBAyDCDBB6UEDwCH0/sMHhqkz5jLw8/My0Du8/v79y6CirMTg6+UOEQA5qLt/MogaMIBsPzjKWFlZwY4bKMCGZD/YQYxg5uAAgy5RDwoHsbCyQFnQXDZ73kKG7z9+QoXoC1iBjjl/4RLDrKkTIAIgB02cMgNEDRiYOnMOlAXNZQMN/vz+A2WNJmrCYNRB2MBoticERrM9KWDUQYQA2EH//v8DcwYKMDIhwgWc7RcvW8mgqqrMICQgwPDvH30b1ezsbAyz5y9iaGusBfPh3aATp84w/Pnzh4GRkb7txz/ARr65iREDBwcHmA930OAADAwAAkb7Ax8Q5ZsAAAAASUVORK5CYII='
    },{
      type: 'interfacediagram',
      label: 'interface',
      properties: {
        data: {
          interfaceName: null,
          methods:[],
          staticFields: []
      }},
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAUCAYAAADlep81AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEBSURBVEhLY/wPBAyDCMAdNHn6LAZmZmawID3B79+/GUwMDRisrSwgAiAH/f7z5//8xUtBzAEBvROnQln//zOBHMUIxiByYAArKwuUxcAAdtAAugUDQBw0iMCogwiBwesgNnY2KIv+gJkJUf7BC8aIuGQGF0d7hl/AgoqeAFQYP37ylKGlvhoiAHLQn79//i9btQbEHBAwdcYcKAtaMILAr5+/oCz6g7///kJZo7mMMIA4CJSsB0n1AQ0hRoZfv+ibu5DB9+8/oCykbL981VqGt+/eMzAx0TeoQAHh6ebMoK6mCuYPuhYjRYn658+fDD+AGAQuXb7KcObcBTCbfMDAAAA+y131rfvv5gAAAABJRU5ErkJggg=='
    },{
      type: 'enumdiagram',
      label: 'enum',
      properties: {
        data: {
          className: null,
          fields:[]
      }},
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAUCAYAAADlep81AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEBSURBVEhLY/wPBAyDCMAdNHn6LAZmZmawID3B79+/GUwMDRisrSwgAiAH/f7z5//8xUtBzAEBvROnQln//zOBHMUIxiByYAArKwuUxcAAdtAAugUDQBw0iMCogwiBwesgNnY2KIv+gJkJUf7BC8aIuGQGF0d7hl/AgoqeAFQYP37ylKGlvhoiAHLQn79//i9btQbEHBAwdcYcKAtaMILAr5+/oCz6g7///kJZo7mMMIA4CJSsB0n1AQ0hRoZfv+ibu5DB9+8/oCykbL981VqGt+/eMzAx0TeoQAHh6ebMoK6mCuYPuhYjRYn658+fDD+AGAQuXb7KcObcBTCbfMDAAAA+y131rfvv5gAAAABJRU5ErkJggg=='
    },{
      type: 'commentdiagram',
      label: 'comment',
      properties: {
        data: {
          content: null
      }},
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAZCAYAAABZ5IzrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFVSURBVEhLY/wPBAyDCDBB6UEDUELoPxDu2XeQ4e/fv1AR6oF/f/8xWFmaMQjw80NFsAOUEHr06AnDqrUbGPj5+BjY2diohjk4OBi4ubkYBCUVGe7eewC1DQcAhRAM3H/w8P/MuQugPOqDnolT/iekZv0/f/ESVAQTYKShP7//QFnUBb9+/Wb48OEjw/xZUxlaOnoZLly6DJVBBXRL1EDPMzAyQthrli1gmDxtNsPFy1cgAkiAbg5iZ2djePrsBUNmXjFDVn4Jg6ioCENKZj5UFglAYg4CQGlo6ow5UB7tQXZBCZSFAANaDv3Gkl4H1EHYwKiDCIFRBxECow4iBEYdRAgMfgexsLJAWbQHTEyY4YHShH346DFDS2cvQ1JcNMOPHz+gorQBXFxcDA0tHQzbN66GikAAapsayNyznzZtanQAsktYSIjBzMQIKgIBo90g/ICBAQB0QHiXkZQ1/QAAAABJRU5ErkJggg=='
    },{
      type: 'line',
      label: '直线',
      callback: () => {
        _this.lf.setDefaultEdgeType('line')
      },
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEjSURBVFhH7de9DoIwEMDxw5mFJ9BZX0VFwA+i9eV4PRYSEBWHysUbiFoE2qsO/hdznX6xrbGOrIMfakSfP9MflGUZCCFoes0aKE1TiKIIPM8D3/dp9U14qG00m07x8kjXdWnlfda+oXkYw2QyhiRJaEURwVgLdkeZ5wVN7bGDHpicps+xgvpiMDZQsBOdt6kZC2i1FbIoTjT1yzgIt2koBjMKCuPut0mVMZDONjUzAvI3B3kqS5r00gYhpizPNOmnBVqu90Yx2GAQYs6XC03mGgRa1dvEgcF6g/B3xvQ2NesFCuqrzYnBOoO4zsxznUCLMJbXqqKJt4+g+p+erCxhsFbQA3OjyU5KEJ4Z2xhM+ZTGZcdxaLKX8tXxDQz2f0q3B3AHPQuprgo8UuwAAAAASUVORK5CYII='
    },{
      type: 'bezier',
      label: '曲线',
      callback: () => {
        _this.lf.setDefaultEdgeType('bezier')
      },
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAcCAYAAAAJKR1YAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAKQSURBVFhH7ZbPS2JRFMe/FUWWWmgEhtGicCXu2rd36a6NC3fRMnCr/RURMzAt/TOMdmJJUf5CIYmMEtHnz0q9887lzJg+dSZ9NC7mA493znn3Pc65950fEMzj46N4eXlhTcvl5SVLWtLptKjX66z18vr6KhKJBGtaYrEYS0KUylUxQwKmhLJSwyzLU8N/h/7EP3Noa2sLR0dHrDEzM/idZV/F29ubvO/s7FAyycvr9Yqbmxs1U5vdLHt4eMDCwgLW19dJ1RCJRLC7u8taL8lkEpubm1haWmILEI/HcX5+jnA4jFQqhefnZxgMBqysrMBqteLi4gLVapVXA263G9++/9B3h+7u7sTe3p5QgxL7+/vi5ORE3N7eCkVReEUXp9Mpd8fv97NFCKVSF7o5dHBwII8hm82yZTSnp6csddGtMB4fHyOTyeDs7Iwt40GFUReHLBYLisUia+MzcaUOhUIIBALY3t5my+RM5BAdUzAYRK1WY4sO0JER+XxeFAoF1rR87Mr9GI1GlrRQt1fLAmtarq+vWer7qfmmFku1Wg6g0+lgdnbwhjocDllrhjHq3Y/Pev4hcmSYM8SwDxLqLMTSYEa92/9s+Mq/RD1m2O121iZn4rSfn59HLpeDzWZjy/iMnfbqyAqfz4fFxUUp6+HMLwbu0Pv7OxqNBiqVCtQ5G+pMjGg0iqurK9k0XS4XDg8PZUPUE1mp1egERdpqtTA3N4fl5WXZtakzU1c2m81QGyFMJhM8Hg/W1tb49S5PT0+yWtO00A99lzr9xsYGW3q5v7+XsxHxqdbRbDblEQ2CxggKgALqh9KaCicFNIhSqYTV1VUpf8qhr6Cs1CdPez1pd1rTtUPtdnu6HCKm6sgA4Ce2entoy7taogAAAABJRU5ErkJggg=='
    }]
    if(!this.silentMode) {
      _this.lf.setMenuConfig({
        graphMenu: [],
        nodeMenu:[{
          text: '删除',
          callback: function(node) {
            _lf.deleteNode(node.id)
          }
        }]
      })
      _this.lf.setPatternItems(patternItems)
    }
    if(this.modelId) {
      Model.findOne(this.modelId).then(res => {
        _this.modelName = res.data.name  
        _this.lf.render(JSON.parse(res.data.data))
      })
    }else {
      _this.lf.render(this.data)
    }
  },
  methods: {
    saveFun() {
      let param = {id: this.modelId, name: this.modelName, data: JSON.stringify(this.lf.getGraphRawData())}
      Model.save(param).then(res => {
        if(res?.code == 0) {
          blogic.showMessage('已保存')
        }else {
          res?.showCodeDesc()
        }
      })
    }
  },
  beforeDestroy() {
    this.lf.destroy()
  }
}
</script>
<template>
    <div>
      <el-text>模型名称：</el-text>
      <el-input v-model="modelName" style="width: 600px;" :readonly="silentMode"/>&nbsp;&nbsp;
      <el-button @click="saveFun" v-if="!silentMode">保存</el-button>
    </div>
    <div ref="container" style="padding-top: 10px"></div>
</template>