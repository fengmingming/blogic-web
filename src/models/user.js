import * as blogic from '../blogic'

class User {
    constructor(arg) {
        this.id = arg.id
        this.phone = arg.phone
        this.name = arg.name
        this.departments = arg.departments
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
    static saveDefProduct(productId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let userId = context.user.userId
        return blogic.axios.put(`/Companies/${companyId}/Users/${userId}?action=setDefProduct`, {productId: productId})
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
    static signUp(param) {
        return blogic.axios.post('/Users', param)
    }
    static updateCompanyInfo(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        let req = {}
        req.departments = param.departmentIds
        req.roles = param.roles
        return blogic.axios.put(`/Companies/${companyId}/Users/${param.id}`, req)
    }
}

class UserInvitation {
    
    constructor(arg) {
        this.id = arg.id
        this.companyId = arg.companyId
        this.phone = arg.phone
        this.userId = arg.userId
        this.status = arg.status
        this.roles = arg.roles
        this.departments = arg.departments
        this.departmentNames = arg.departmentNames
        this.createTime = arg.createTime
    }

    static findAll() {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.get(`/Companies/${companyId}/UserInvitations`)
    }

    static findMySelf() {
        let context = blogic.loadContext()
        let userId = context.user.userId
        return blogic.axios.get(`/Users/${userId}/UserInvitations`)
    }

    static save(param) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.post(`/Companies/${companyId}/UserInvitations`, param)
    }

    static accept(userInvitationId) {
        let context = blogic.loadContext()
        let userId = context.user.userId
        return blogic.axios.put(`/Users/${userId}/UserInvitations/${userInvitationId}?action=accept`)
    }

    static reject(userInvitationId) {
        let context = blogic.loadContext()
        let userId = context.user.userId
        return blogic.axios.put(`/Users/${userId}/UserInvitations/${userInvitationId}?action=reject`)
    }

    static cancel(userInvitationId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.put(`/Companies/${companyId}/UserInvitations/${userInvitationId}?action=cancel`)
    }

    static reInvite(userInvitationId) {
        let context = blogic.loadContext()
        let companyId = context.currentCompany.companyId
        return blogic.axios.put(`/Companies/${companyId}/UserInvitations/${userInvitationId}?action=reInvite`)
    }

}

export {
    User,UserInvitation
}
