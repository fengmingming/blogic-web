import * as blogic from '../blogic'

class TestCase {
    constructor(props) {
        this.id = props.id
        this.iterationId = props.iterationId
        this.iterationName = props.iterationName
        this.requirementId = props.requirementId
        this.requirementName = props.requirementName
        this.productId = props.productId
        this.title = props.title
        this.priority = props.priority
        this.precondition = props.precondition
        this.steps = props.steps
        this.ownerUserId = props.ownerUserId
        this.ownerUserName = props.ownerUserName
        this.smoke = props.smoke
        this.status = props.status
        this.statusDesc = props.statusDesc
        this.completeTime = props.completeTime
        this.createUserId = props.createUserId
        this.createUserName = props.createUserName
        this.createTime = props.createTime
        this.updateTime = props.updateTime
    }

    static toTestCase(arr) {
        let objs = []
        arr.forEach(obj => {
            objs.push(new TestCase(obj))
        })
        return objs
    }

    static findList(query) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        let queryStr = blogic.objToQuery(query)
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/TestCases?${queryStr}`)
    }

    static findOne(testCaseId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/TestCases/${testCaseId}`)
    }

    static save(testCase) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        if(testCase.id) {
            let {id, ... body} = {... testCase}
            return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/TestCases/${id}`, body)
        }else {
            return blogic.axios.post(`/Companies/${companyId}/Products/${productId}/TestCases`, testCase)
        }
    }

}

export {
    TestCase
}