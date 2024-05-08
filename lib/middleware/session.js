const map = new Map()

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    })
}

function clearSession() {
    map.forEach((value, key) => {
        if (Date.now() > value.expires) {
            map.delete(key)
        }
    })
}

/**
 * Session middleware
 * @param {Number} expires expires time (s)
 * @param {string} prefix cookie prefix
 * 
 * @returns {Function} (req, res, next) => {}
 */
export default function(expires, prefix) {
    if (!expires || isNaN(expires)) throw 'require session expires'

    return async (req, res, next) => {

        let id = req.cookie[[prefix]]
        if (!id) id = guid()

        // Write cookie
        res.cookie(prefix, id, expires)

        // Clear expires session
        clearSession()

        // Get target session
        let session = map.get(id)
        res.session = req.session = session ? session.value : new Map()

        // Invoke next middleware
        await next(req, res)

        // Save memory cache
        if (req.session.size == 0) return

        map.set(id, {
            value: req.session,
            expires: Date.now() + expires
        })
    }
}