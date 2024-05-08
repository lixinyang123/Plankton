import path from 'path'
import ejs from './ejs/ejs.js'

var views = ejs();

export default class Response {

    static init(res) {
        res.cookie = this.cookie
        res.redirect = this.redirect
        res.json = this.json
        res.render = this.render
        res.bad = this.bad
        res.forbidden = this.forbidden
        res.notfound = this.notfound
        res.error = this.error
        return res
    }

    static cookie(key, value, time = undefined, path = '/', ) {
        let expires = () => {
            let date = new Date()
            date.setTime(Date.now() + time)
            return time ? `expires=${date.toGMTString()};` : ''
        }

        this.setHeader('Set-Cookie', `${key}=${value}; ${expires()} path=${path};`)
    }

    static redirect(path) {
        this.statusCode = 302
        this.setHeader('Location', path)
    }

    static json(obj) {
        this.setHeader('content-type', 'application/json')
        this.write(JSON.stringify(obj))
    }

    static bad(text = 'bad request') {
        this.statusCode = 400
        this.write(text)
    }

    static forbidden(text = 'forbidden') {
        this.statusCode = 403
        this.write(text)
    }

    static notfound(text = 'not found') {
        this.statusCode = 404
        this.write(text)
    }

    static error(text = 'error') {
        this.statusCode = 500
        this.write(text)
    }

    static async render(fileName, data = {}) {
        fileName = path.join(process.cwd(), 'src/views', fileName)

        let html = await new Promise((resolve, reject) => {
            views.render(fileName, Object.assign(this, data), (err, html) => {
                if (err) reject(err)
                resolve(html)
            })
        })

        this.setHeader('content-type', 'text/html')
        this.write(html)
    }
}