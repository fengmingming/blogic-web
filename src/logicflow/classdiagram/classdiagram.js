import { HtmlResize } from "@logicflow/extension"
import { ElButton,ElInput,ElTag,ElCard } from 'element-plus'
import { defineComponent, h, render as vueRender } from 'vue'

const classView = defineComponent({
    name: 'ClassView',
    components: {
        'el-button': ElButton,
        'el-input': ElInput,
        'el-tag': ElTag,
        'el-card': ElCard
    },
    props:['modelValue'],
    template: `
        <div>
            <el-tag type="info">class</el-tag>
            <el-input v-model="className" placeholder="class name"/>
            <el-input type="textarea" v-model="fields" placeholder="+fieldName:type" :autosize="{ minRows: 2}"/>
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

class ClassNodeModel extends HtmlResize.model {

    initNodeData(data) {
        super.initNodeData(data);
        this.height = 165
        this.width = 265
    }

    setAttributes() {
        this.text.editable = false
        this.setZIndex(100)
    }

}

class ClassNode extends HtmlResize.view {

    shouldUpdate() {
        return !(this.currentProperties === this.preProperties)
    }

    setHtml(rootEl) {
        const properties  = JSON.parse(this.currentProperties)
        if (!this.shouldUpdate()) return
        let modelValue = properties.data
        const vm = h(classView, {modelValue})
        vueRender(vm, rootEl)
    }

}

export default {
    type: 'classdiagram',
    view: ClassNode,
    model: ClassNodeModel
}