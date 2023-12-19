import * as blogic from '../blogic'

class User {
    constructor(){}
    static switchCompany(companyId) {
        let context = blogic.loadContext()
        return blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId})
    }
    static findAll() {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.get(`/Users?companyId=${companyId}`)
    }
}

export {
    User,
}