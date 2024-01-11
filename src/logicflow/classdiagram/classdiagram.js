import {HtmlNodeModel, HtmlNode} from '@logicflow/core'

class ClassNodeModel extends HtmlNodeModel {

    setAttributes() {
        const props = this.properties || {}
        const len = Object.keys(props)
        this.text.editable = false
        const width = 100 + (len * 50)
        const height = 130
        this.width = width
        this.height = height
        this.anchorsOffset = [
          [width / 2, 0],
          [0, height / 2],
          [-width / 2, 0],
          [0, -height/2],
        ]
    }
    
}

class ClassNode extends HtmlNode {

    shouldUpdate() {
        const { properties } = this.getAttributes()
        if (this.currrentProperties && this.currrentProperties === JSON.stringify(properties)) return false
        this.currrentProperties = JSON.stringify(properties)
        return true
    }

    setHtml(rootEl) {
        const { properties } = this.getAttributes()
        if (!this.shouldUpdate()) return
        const el = document.createElement('div')
        let javaClass = new JavaClass(properties.javaClass)
        //包名
        let packageHtml = _packageHtml(javaClass)
        //类名
        let classNameHtml = _classNameHtml(javaClass)
        //属性
        let fieldHtml = _fieldHtml(javaClass)
        //方法
        let methodHtml = _methodHtml(javaClass)
        el.innerHTML = (packageHtml + classNameHtml + fieldHtml + methodHtml)
        rootEl.innerHTML = ''
        rootEl.appendChild(el)
    }

}

class JavaClass {
    
    constructor(arg) {
        this.packageName = arg.packageName
        this.className = arg.className
        this.parentClassName = arg.parentClassName
        this.interfaces = arg.interfaces
        this.fields = arg.fields
        this.methods = arg.methods
    }

}

function _packageHtml(javaClass) {
    return `<div>包名: ${javaClass.package || ''}</div>`
}

function _classNameHtml(javaClass) {
    return `<div>类名: ${javaClass.className}</div>`
}

function _fieldHtml(javaClass) {
    let fields = javaClass.fields
    let html = '<div>属性:</div>'
    if(fields) {
        html = html + fields.map(field => {
            return `<div>  ${field.type} ${field.name}</div>`
        }).join('')
    }
    return html
}

function _methodHtml(javaClass) {
    let methods = javaClass.methods
    let html = '<div>方法:</div>'
    if(methods) {
        html = html + methods.map(method => {
            let args = ''
            if(method.args) {
                args = method.args.map(arg => {
                    return `${simpleClassName(arg.type)} ${arg.name}`
                }).join(',')
                args = args.substring(0, args.length - 1)
            }
            return `<div>  ${method.name}(${args})</div>`
        }).join('')
    }
    return html
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