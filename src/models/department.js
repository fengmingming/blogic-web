import * as blogic from '../blogic'

class Department {
    constructor(arg) {
        this.id = arg.id
        this.departmentName = arg.departmentName
        this.parentId = arg.parentId
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

function appendChildren(d, map) {
    d.children = map[d.id]
    d.children?.forEach(c => {
        appendChildren(c, map)
    })
}

export {
    Department
}