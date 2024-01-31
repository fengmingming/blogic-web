import * as blogic from '../blogic'

class Task {
    constructor(task) {
        this.id = task.id
        this.requirementId = task.requirementId
        this.requirementName = task.requirementName
        this.iterationId = task.iterationId
        this.iterationName = task.iterationName
        this.taskName = task.taskName
        this.taskDesc = task.taskDesc
        this.status = task.status
        this.currentUserId = task.currentUserId
        this.currentUserName = task.currentUserName
        this.completeUserId = task.completeUserId
        this.completeUserName = task.completeUserName
        this.startTime = task.startTime
        this.priority = task.priority
        this.finalTime = task.finalTime
        this.completeTime = task.completeTime
        this.overallTime = task.overallTime
        this.consumeTime = task.consumeTime
        this.createUserId = task.createUserId
        this.createUserName = task.createUserName
        this.createTime = task.createTime
        this.updateTime = task.updateTime
    }

    static toTask(arr) {
        let objs = []
        arr.forEach(obj => {
            objs.push(new Task(obj))
        })
        return objs
    }

    static findList(params) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        let query = blogic.objToQuery(params)
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Tasks?${query}`)
    }

    static findOne(taskId) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.get(`/Companies/${companyId}/Products/${productId}/Tasks/${taskId}`)
    }

    static save(task) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        if(task.id) {
            return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${task.id}`, task)
        }else {
            return blogic.axios.post(`/Companies/${companyId}/Products/${productId}/Tasks`, task)
        }
    }

    static start(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=startTask`, param)
    }

    static appoint(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=appointTask`, param)
    }

    static complete(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=completeTask`, param)
    }

    static cancel(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=cancelTask`, param)
    }

    static pause(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=pauseTask`, param)
    }

    static resume(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=resumeTask`, param)
    }

    static recordDailyPapers(param) {
        let companyId = blogic.getCurCompanyId()
        let productId = blogic.getCurProductId()
        return blogic.axios.put(`/Companies/${companyId}/Products/${productId}/Tasks/${param.id}?action=submitDailyPapers`, param)
    }

}

export {
    Task
}