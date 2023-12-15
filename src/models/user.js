import * as blogic from '../blogic'

class User {
    constructor(){}
    static switchCompany(companyId) {
        let context = blogic.loadContext()
        return blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId})
    }
    static findAll() {
        let context = blogic.loadContext()
        return new Promise(resolve => {
            resolve({code:0, data:[]})
        })
    }
}

export {
    User,
}