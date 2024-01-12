import * as blogic from '../blogic'

class Department {
    constructor(arg) {
        this.id = arg.id
        this.departmentName = arg.departmentName
        this.parentId = arg.parentId
    }

    static buildSelectData(trees) {
        let arr = []
        trees.forEach(node => {
            assembleByDepthFirst(node, 0, arr)
        })
        return arr
    }

    static buildTree(departments) {
        let objs = []
        let map = {}
        departments.forEach(d => {
            if(d.parentId) {
                let arr = map[d.parentId]
                if(!arr) {
                    arr = []
                    map[d.parentId] = arr
                }
                arr.push(d)
            }else {
                objs.push(d)
            }
        })
        objs.forEach(obj => appendChildren(obj, map))
        return objs
    }

    static findAll() {
        let companyId = blogic.getCurCompanyId()
        return blogic.axios.get(`/Companies/${companyId}/Departments`)
    }

    static save(department) {
        let companyId = blogic.getCurCompanyId()
        if(department.id) {
            return blogic.axios.put(`/Companies/${companyId}/Departments/${department.id}`, department)
        }else {
            return blogic.axios.post(`/Companies/${companyId}/Departments`, department)
        }
    }

}

function assembleByDepthFirst(node, level, arr) {
    let {id, departmentName, parentId} = node
    let prefix = ''
    for(let i = 0;i < level;i++) {
        prefix = prefix + '+'
    }
    departmentName = prefix + departmentName
    arr.push({id, departmentName, parentId})
    if(node.children) {
        node.children.forEach(c => {
            assembleByDepthFirst(c, level + 1, arr)
        })
    }
}

function appendChildren(d, map) {
    d.children = map[d.id]
    d.children?.forEach(c => {
        appendChildren(c, map)
    })
}

export {
    Department
}