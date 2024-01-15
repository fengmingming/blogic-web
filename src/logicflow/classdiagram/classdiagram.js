import {HtmlNodeModel, HtmlNode} from '@logicflow/core'
import { ElButton } from 'element-plus';
import { defineComponent, h, render as vueRender } from 'vue';

const classView = defineComponent({
    name: 'ClassView',
    components: {
        'el-button': ElButton
    },
    props:['classData'],
    template: `
        
    `,
    data() {
        return {}
    },
    setup(props) {
        
    },
})

class ClassNodeModel extends HtmlNodeModel {

    setAttributes() {
        this.text.editable = false
        this.height = 200
        this.width = 200
    }

}

class ClassNode extends HtmlNode {

    shouldUpdate() {
        return !(this.currentProperties === this.preProperties)
    }

    setHtml(rootEl) {
        const properties  = JSON.parse(this.currentProperties)
        if (!this.shouldUpdate()) return
        let classData = new ClassModel(properties.classData)
        classData.className = 'edd'
        const vm = h(classView, {classData})
        vueRender(vm, rootEl)
    }

}

class ClassModel {
    
    constructor(arg) {
        this.packageName = arg.packageName
        this.className = arg.className
        this.parentClassName = arg.parentClassName
        this.interfaces = arg.interfaces
        this.fields = arg.fields
        this.methods = arg.methods
    }

}

function simpleClassName(arg) {
    let index = arg.lastIndexOf('.')
    if(index > 0) {
        arg = arg.substring(index + 1)
    }
    return arg
}

export default {
    type: 'classdiagram',
    view: ClassNode,
    model: ClassNodeModel
}