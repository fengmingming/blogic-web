import * as blogic from '../blogic'

class Bug {

    constructor(props) {
        this.id = props.id 
        this.testCaseId = props.testCaseId
        this.teatCaseTitle = props.testCaseTitle
        this.requirementId = props.requirementId
        this.requirementName = props.requirementName
        this.iterationId = props.iterationId
        this.iterationName = props.iterationName
        this.productId = props.productId
        this.iterationVersion = props.iterationVersion
        this.title = props.title
        this.bugType = props.bugType
        this.env = props.env
        this.device = props.device
        this.reproSteps = props.reproSteps
        this.status = props.status
        this.severity = props.severity
        this.priority = props.priority
        this.currentUserId = props.currentUserId
        this.currentUserName = props.currentUserName
        this.fixUserId = props.fixUserId
        this.fixUserName = props.fixUserName
        this.fixSolution = props.fixSolution
        this.fixVersion = props.fixVersion
        this.createUserId = props.createUserId
        this.createUserName = props.createUserName
        this.createTime = props.createTime
        this.updateTime = props.updateTime
    }

    static toBug(arr) {
        let objs = []
        arr.forEach(obj => {
            objs.push(new Bug(obj))
        })
        return objs
    }

    static findMyList(query) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let queryStr = blogic.objToQuery(query)
        return blogic.axios.get(`/Companies/${companyId}/Products/Bugs?${queryStr}`)
    }

    static findList(query) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        let queryStr = blogic.objToQuery(query)
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Bugs?${queryStr}`)
    }

    static findOne(bugId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Bugs/${bugId}`)
    }

    static save(bug) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        let {id, ... body} = {... bug}
        if(bug.id) {
            return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Bugs/${id}`, body)
        }else {
            return blogic.axios.post(`/Companies/${companyId}/Products/${productId}/Bugs`, body)
        }
    }

    static confirm(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Bugs/${param.id}?action=confirmBug`, param)
    }

    static appoint(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Bugs/${param.id}?action=appointBug`, param)
    }

    static close(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Bugs/${param.id}?action=closeBug`, param)
    }

    static fix(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Bugs/${param.id}?action=fixBug`, param)
    }

}

export {
    Bug
}

 