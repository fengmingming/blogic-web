import {HtmlNodeModel, HtmlNode} from '@logicflow/core'
import { ElButton,ElText } from 'element-plus';
import { defineComponent, h, render as vueRender } from 'vue';

const classView = defineComponent({
    name: 'ClassView',
    components: {
        'el-button': ElButton,
        'el-text': ElText,
    },
    props:['classData'],
    template: `
        <table class="blogic_cd">
            <tr style=""><td>{{ classData.className }}</td></tr>
            <tr>
                <td>
                    <div v-for="field in classData.fields"><el-text :truncated="true">{{ field.name }}:{{ simpleClassName(field.type) }}</el-text></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div v-for="method in classData.methods"><el-text :truncated="true">{{ method.name }}({{ method.args?.map(it => simpleClassName(it)).join(',') }}):{{ simpleClassName(method.returnType) }}</el-text></div>
                </td>
            </tr>
        </table>
    `,
    data() {
        return {
        }
    },
    setup(props) {
        const simpleClassName = (arg) => {
            if(!arg) return ''
            let index = arg.lastIndexOf('.')
            if(index > 0) {
                arg = arg.substring(index + 1)
            }
            return arg
        }
        return {simpleClassName}
    },
})

class ClassNodeModel extends HtmlNodeModel {

    setAttributes() {
        this.text.editable = false
        const classData = this.properties?.classData
        this.height = 60
        if(classData?.fields) {
            this.height = this.height + classData.fields.length * 23
        }
        if(classData?.methods) {
            this.height = this.height + classData.methods.length * 23
        }
        this.width = 265
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
        const vm = h(classView, {classData})
        vueRender(vm, rootEl)
    }

}

class ClassModel {
    
    constructor(arg) {
        this.packageName = arg.packageName
        this.className = arg.className
        this.parentClassNames = arg.parentClassNames
        this.interfaceNames = arg.interfaceNames
        this.fields = arg.fields
        this.methods = arg.methods
    }

}

export default {
    type: 'classdiagram',
    view: ClassNode,
    model: ClassNodeModel
}