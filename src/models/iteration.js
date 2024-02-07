import * as blogic from '../blogic'

class Iteration {
    
    constructor(props) {
        this.id = props.id
        this.productId = props.productId
        this.versionCode = props.versionCode
        this.name = props.name
        this.scheduledStartTime = props.scheduledStartTime
        this.scheduledEndTime = props.scheduledEndTime
        this.status = props.status
        this.createUserId = props.createUserId
        this.createTime = props.createTime
        this.updateTime = props.updateTime
        this.users = props.users
    }

    static toIteration(arr) {
        let objs = []
        arr.forEach(props => {
            objs.push(new Iteration(props))
        })
        return objs
    }

    static findMyList(params) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let query = blogic.objToQuery(params)
        return blogic.axios.get(`/Companies/${companyId}/Products/Iteration?${query}`)
    }

    static findList(params) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        let query = blogic.objToQuery(params)
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Iteration?${query}`)
    }

    static findOne(iterationId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Iteration/${iterationId}`)
    }

    static save(iteration) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        if(iteration.id) {
            let {id, ... params} = {... iteration}
            return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Iteration/${iteration.id}`, params)
        }else {
            return blogic.axios.post(`/Companies/${companyId}/Products/${productId}/Iteration`, iteration)
        }
    }

}

export {
    Iteration
}