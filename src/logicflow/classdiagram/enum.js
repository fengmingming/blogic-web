import { HtmlResize } from "@logicflow/extension"
import { ElButton,ElInput,ElTag,ElCard } from 'element-plus'
import { defineComponent, h, render as vueRender } from 'vue'

const enumView = defineComponent({
    name: 'EnumView',
    components: {
        'el-button': ElButton,
        'el-input': ElInput,
        'el-tag': ElTag,
        'el-card': ElCard
    },
    props:['modelValue'],
    template: `
        <div>
            <el-tag type="info">enum</el-tag>
            <el-input v-model="className" placeholder="class name"/>
            <el-input type="textarea" v-model="fields" placeholder="name(arg,...)" :autosize="{ minRows: 2}"/>
        </div>
    `,
    data() {
        return {...this.modelValue}
    },
    setup(props) {
        return {}
    },
})

class EnumNodeModel extends HtmlResize.model {

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

class EnumNode extends HtmlResize.view {

    shouldUpdate() {
        return !(this.currentProperties === this.preProperties)
    }

    setHtml(rootEl) {
        const properties  = JSON.parse(this.currentProperties)
        if (!this.shouldUpdate()) return
        let modelValue = properties.data
        const vm = h(enumView, {modelValue})
        vueRender(vm, rootEl)
    }

}

export default {
    type: 'enumdiagram',
    view: EnumNode,
    model: EnumNodeModel
}