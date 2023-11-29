import * as blogic from '../blogic'
const axios = blogic.axios

function toProduct(datas) {
    let products = [];
    for(data in datas) {

    }
}
/* model */
class Product {
    constructor() {
    }
    static async findByCompanyId(companyId) {
        let res = await axios.get('/Companies/' + companyId)

        return res;
    }
}

export {
    Product
}