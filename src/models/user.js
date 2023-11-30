import * as blogic from '../blogic'

class User {
    constructor(){}
    static async switchCompany(companyId) {
        let context = blogic.loadContext()
        let switchContextRes = await blogic.axios.put('/Users/'+context.user.userId+'/switchContext', {companyId})
        console.log(1)
        if(switchContextRes?.code !== 0) {
            console.log(11)
            switchContextRes?.showCodeDesc()
            throw switchContextRes?switchContextRes.codeDesc:blogic.InterruptOperation
        }
    }
}

export {
    User,
}