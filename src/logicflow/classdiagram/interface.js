import { HtmlResize } from "@logicflow/extension"
import { ElButton,ElInput,ElTag,ElCard } from 'element-plus'
import { defineComponent, h, render as vueRender } from 'vue'

const interfaceView = defineComponent({
    name: 'InterfaceView',
    components: {
        'el-button': ElButton,
        'el-input': ElInput,
        'el-tag': ElTag,
        'el-card': ElCard
    },
    props:['modelValue'],
    template: `
        <div>
            <el-tag type="info">interface</el-tag>
            <el-input v-model="interfaceName" placeholder="interface name"/>
            <el-input type="textarea" v-model="methods" placeholder="+methodName(arg:type,...):type" :autosize="{ minRows: 2}"/>
        </div>
    `,
    data() {
        return {...this.modelValue}
    },
    setup(props) {
        return {}
    },
})

class InterfaceNodeModel extends HtmlResize.model {

    initNodeData(data) {
        super.initNodeData(data);
        this.height = 115
        this.width = 265
    }

    setAttributes() {
        this.text.editable = false
        this.setZIndex(100)
    }

}

class InterfaceNode extends HtmlResize.view {

    shouldUpdate() {
        return !(this.currentProperties === this.preProperties)
    }

    setHtml(rootEl) {
        const properties  = JSON.parse(this.currentProperties)
        if (!this.shouldUpdate()) return
        let modelValue = properties.data
        const vm = h(interfaceView, {modelValue})
        vueRender(vm, rootEl)
    }

}

export default {
    type: 'interfacediagram',
    view: InterfaceNode,
    model: InterfaceNodeModel
}