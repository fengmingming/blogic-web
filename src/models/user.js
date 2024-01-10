import * as blogic from '../blogic'

class User {
    constructor(arg) {
        this.id = arg.id
        this.phone = arg.phone
        this.name = arg.name
        this.departemnts = arg.departemnts
        this.roles = arg.roles
        this.joinTime = arg.joinTime
        this.admin = arg.admin
    }
    static toUsers(arr) {
        let objs = []
        arr.forEach(it => {
            objs.push(new User(it))
        })
        return objs
    }
    static switchCompany(companyId) {
        let context = blogic.loadContext()
        return blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId})
    }
    static findAll() {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.get(`/Users?companyId=${companyId}`)
    }
    static findByProductId(productId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.get(`/Users?companyId=${companyId}&productId=${productId}`)
    } 
    static findByIterationId(iterationId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.get(`/Users?companyId=${companyId}&iterationId=${iterationId}`)
    }
}

export {
    User,
}