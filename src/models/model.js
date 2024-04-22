import * as blogic from '../blogic'

class Model {

    static findList(query) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        let queryStr = blogic.objToQuery(query)
        //return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Models?${queryStr}`)
        return new Promise((r) => {r({code:0, data: {total: 0, records:[]}})}, () => {})
    }

    static findOne(id) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        //return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Models/${id}`)
        return new Promise((r) => {r({code:0, data: {}})}, () => {})
    }

    static save(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let productId = context.currentProduct.productId
        if(param.id) {
            //return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Models/${param.id}`, param)
        }else {
            //return blogic.axios.post(`/Companies/${companyId}/Products/${productId}/Models`, param)
        }
        return new Promise((r) => {r({code:0, data: {}})}, () => {})
    }

}

export {
    Model
}