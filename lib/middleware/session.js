function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    })
}

export default function(expires, prefix) {
    const map = new Map()

    return async (req, res, next) => {

        let id = req.cookie[[prefix]]
        if (!id) id = guid()
        res.cookie(prefix, id, expires)

        req.session = map.get(id)
        if (!req.session) req.session = new Map()
        res.session = req.session

        await next(req, res)
        map.set(id, req.session)
    }
}