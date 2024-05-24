export default async function(req, res, next) {
    await next(req, res).catch(error => {
        res.error(JSON.stringify({ error }))
    })
}