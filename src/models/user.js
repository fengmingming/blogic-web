import * as blogic from '../blogic'

class User {
    constructor(){}
    static switchCompany(companyId) {
        let context = blogic.loadContext()
        return blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId})
    }
}

export {
    User,
}