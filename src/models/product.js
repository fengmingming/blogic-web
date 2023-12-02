import * as blogic from '../blogic'
const axios = blogic.axios

/* model */
class Product {
    constructor(arg) {
        this.id = arg.id
        this.companyId = arg.companyId
        this.productName = arg.productName
        this.productDesc = arg.productDesc
        this.createUserId = arg.createUserId
        this.createUserName = arg.createUserName
        this.createTime = arg.createTime
        this.updateTime = arg.updateTime
    }
    
    static findByCompanyId(companyId) {
        return axios.get('/Companies/' + companyId + '/Products?pageSize=100&pageNum=1')
    }

    static find(query) {
        return axios.get('/Companies/' + query.companyId + '/Products?' + blogic.objToQuery(query))
    }

    static toProduct(datas) {
        let products = [];
        for(let data of datas) {
            products.push(new Product(data))
        }
        return products
    }
    
}

export {
    Product
}