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

    static findByDictType(dictType) {
        return blogic.axios.get('/Dict?dictType=' + dictType)
    }

    static toMap(arr) {
        let obj = {}
        arr.forEach(a => {
            obj[a.code] = a.codeDesc
        })
        return obj
    }

}

export {
    Dict
}