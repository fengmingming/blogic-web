import * as blogic from '../blogic'

const dictCache = {

}
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
        let values = dictCache[dictType]
        if(values === undefined) {
            values = blogic.axios.get('/Dict?dictType=' + dictType)
            dictCache[dictType] = values
        }
        return values
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