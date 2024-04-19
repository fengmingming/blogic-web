import { HtmlResize } from "@logicflow/extension"
import { ElInput, ElTag, ElRow, ElForm, ElFormItem, ElCol } from 'element-plus'
import { defineComponent, h, render as vueRender } from 'vue'

const pkgView = defineComponent({
    name: 'PkgView',
    components: {
        'el-input': ElInput,
        'el-tag': ElTag,
        'el-form': ElForm,
        'el-form-item': ElFormItem
    },
    props:['modelValue'],
    template: `
        <div>
            <div style="width:90%;background-color:white;height:50px">
            <el-form>
                <el-form-item>
                    <template #label>
                        <el-tag type="info" size="large">package</el-tag>
                    </template>
                    <el-input v-model="packageName" placeholder="package name"/>
                </el-form-item>
            </el-form>
            </div>
            <div style="width:99%;min-height:1000px;border:1px solid var(--el-border-color);margin-top:-15px">
            </div>
        </div>
    `,
    data() {
        return {...this.modelValue}
    },
    setup(props) {
        return {}
    },
})

class PackageNodeModel extends HtmlResize.model {

    initNodeData(data) {
        super.initNodeData(data);
        this.height = 450
        this.width = 900
    }

    setAttributes() {
        this.text.editable = false
        this.setZIndex(0)
    }

}

class PackageNode extends HtmlResize.view {

    shouldUpdate() {
        return !(this.currentProperties === this.preProperties)
    }

    setHtml(rootEl) {
        const properties  = JSON.parse(this.currentProperties)
        if (!this.shouldUpdate()) return
        let modelValue = properties.data
        const vm = h(pkgView, {modelValue})
        vueRender(vm, rootEl)
    }

}

export default {
    type: 'packagediagram',
    view: PackageNode,
    model: PackageNodeModel
}