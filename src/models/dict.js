import * as blogic from '../blogic'

class Dict {
    constructor(dict) {
        this.id = dict.id
        this.code = dict.code
        this.codeDesc = dict.codeDesc
    }

    static toDict(dicts) {
        let objs = []
        dicts.forEach(dict => {
            objs.push(new Dict(dict))
        })
        return objs
    }

    static findByCode(dictType) {
        return blogic.axios.get('/Dict?dictType=' + dictType)
    }

}

export default {
    Dict
}