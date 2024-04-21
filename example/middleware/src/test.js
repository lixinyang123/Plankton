export default async function (req, res, next) {
    res.write('<p>middleware 3 start</p>')
    await next(req, res)
    res.write('<p>middleware 3 end</p>')
}