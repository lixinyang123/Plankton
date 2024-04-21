import fs from 'fs'
import path from 'path'

export default function(wwwroot = 'wwwroot', requestPath = '/') {
    return async (req, res, next) => {

        if (!requestPath.startsWith('/')) requestPath = `/${requestPath}`

        let pathname = new URL(req.url, 'http://localhost').pathname
        if (pathname.startsWith(requestPath)) pathname = pathname.replace(requestPath, '/')

        let fileName = path.join(process.cwd(), 'src', wwwroot, pathname)

        if (!fs.existsSync(fileName) || !fs.lstatSync(fileName).isFile()) {
            await next(req, res)
            return
        }

        let contentType = undefined

        switch (fileName.split('.').at(-1)) {
            case 'html':
                contentType = 'text/html'
                break

            case 'css':
                contentType = 'text/css'
                break

            case 'js':
                contentType = 'application/javascript'
                break

            case 'png':
                contentType = 'image/png'
                break

            default:
                contentType = 'text/plain'
                break
        }

        res.setHeader("content-type", contentType)
        res.end(fs.readFileSync(fileName))
    }
}