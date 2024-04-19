import { HtmlResize } from "@logicflow/extension"
import { ElButton,ElInput,ElTag,ElCard } from 'element-plus'
import { defineComponent, h, render as vueRender } from 'vue'

const commentView = defineComponent({
    name: 'CommentView',
    components: {
        'el-button': ElButton,
        'el-input': ElInput,
        'el-tag': ElTag,
        'el-card': ElCard
    },
    props:['modelValue'],
    template: `
        <div>
            <el-tag type="info">note</el-tag>
            <el-input type="textarea" v-model="content" :autosize="{ minRows: 10}" input-style="background-color: rgb(240, 240, 200)"/>
        </div>
    `,
    data() {
        return {...this.modelValue}
    },
    setup(props) {
        return {}
    },
})

class CommentNodeModel extends HtmlResize.model {

    initNodeData(data) {
        super.initNodeData(data);
        this.height = 250
        this.width = 165
    }

    setAttributes() {
        this.text.editable = false
        this.setZIndex(100)
    }

}

class CommentNode extends HtmlResize.view {

    shouldUpdate() {
        return !(this.currentProperties === this.preProperties)
    }

    setHtml(rootEl) {
        const properties  = JSON.parse(this.currentProperties)
        if (!this.shouldUpdate()) return
        let modelValue = properties.data
        const vm = h(commentView, {modelValue})
        vueRender(vm, rootEl)
    }

}

export default {
    type: 'commentdiagram',
    view: CommentNode,
    model: CommentNodeModel
}