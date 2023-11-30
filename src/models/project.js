import * as blogic from '../blogic'
const axios = blogic.axios

function toProduct(datas) {
    let products = [];
    for(var data in datas) {
        products.push(new Product(data))
    }
    return products
}
/* model */
class Product {
    constructor(arg) {
        this.id = arg.id
        this.companyId = arg.companyId
        this.productName = arg.productName
        this.productDesc = arg.productDesc
        this.createUserId = arg.createUserId
        this.createTime = arg.createTime
        this.updateTime = arg.updateTime
    }
    static async findByCompanyId(companyId) {
        let res = await axios.get('/Companies/' + companyId)
        console.log(res)
        return res
    }
}

export {
    Product
}