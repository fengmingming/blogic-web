import * as blogic from '../blogic'

class Task {
    constructor(task) {
        this.id = task.id
        this.requirementId = task.requirementId
        this.iterationId = task.iterationId
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
        this.createUserName = task.createUserName
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

}

export {
    Task
}