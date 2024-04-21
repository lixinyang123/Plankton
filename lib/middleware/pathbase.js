export default function(basePath) {
    return async (req, res, next) => {
        if (req.pathname.startsWith(basePath)) {
            req.pathname = req.pathname.replace(basePath, '')
        }

        await next(req, res)
    }
}