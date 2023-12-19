import * as blogic from '../blogic'

class Requirement {

    constructor(arg) {
        this.id = arg.id
        this.productId = arg.productId
        this.requirementName = arg.requirementName
        this.requirementSources = arg.requirementSources
        this.requirementDesc = arg.requirementDesc
        this.requirementStatus = arg.requirementStatus
        this.createUserId = arg.createUserId
        this.createUserName = arg.createUserName
        this.createTime = arg.createTime
        this.updateTime = arg.updateTime
        this.deleted = arg.deleted
    }

    static toRequirement(arr) {
        let objs = []
        arr.forEach(obj => {
            objs.push(new Requirement(obj))
        })
        return objs
    }

    static findList(params) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        let query = blogic.objToQuery(params)
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Requirements?` + query)
    }

    static findOne(requirementId) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Requirements/${requirementId}`)
    }

    static save(params) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        if(params.id) {
            let requirementId = params.id
            let url = `/Companies/${companyId}/Products/${productId}/Requirements/${requirementId}`
            return blogic.axios.put(url, params)
        }else {
            let url = `/Companies/${companyId}/Products/${productId}/Requirements`
            return blogic.axios.post(url, params)
        }
    }

}

export {
    Requirement
}