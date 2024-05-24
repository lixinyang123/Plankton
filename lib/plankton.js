import fs from 'fs'
import http from 'http'
import path from 'path'

import Response from './response.js'
import Request from './request.js'
import { pathToFileURL } from 'url'
import { Group } from './group.js'
import { Middleware } from './middleware.js'
import { Logger } from './logger.js'

// default middlewares
import Cors from './middleware/cors.js'
import StaticFile from './middleware/staticfile.js'
import PathBase from './middleware/pathbase.js'
import Session from './middleware/session.js'
import ErrorPage from './middleware/errorpage.js'

export class Plankton {
    constructor() {
        this.pipeline = undefined
        this.middlewares = []
        this.actions = []
        this.logger = new Logger()
        this.hasBuilt = false

        this.server = http.createServer(async (req, res) => {
            let date = new Date()

            await this.pipeline.invoke(
                Request.init(req, this.host),
                Response.init(res),
                this.pipeline
            ).catch(error => {
                this.logger.log(error, 'error')
                res.statusCode = 500
                res.end('Server error')
            })

            if (!res.writableEnded) res.end()

            let times = `${new Date().getTime() - date.getTime()}ms`
            this.logger.log(`${date}\n\r${req.method} ${req.url}\n\r${times}`)
        })
    }

    async #endpoint(req, res) {
        let action = this.actions
            .filter(i => new RegExp(`^${i.path}$`, 'i').test(req.pathname))
            .sort((a, b) => b.path.length - a.path.length)
            .at(0)

        if (!action) {
            res.notfound()
            return
        }

        if (action.method && action.method != req.method.toLowerCase()) {
            res.bad()
            return
        }

        await action.invoke(req, res).catch(err => { throw err })
    }

    /**
     * Use middleware
     * @param {Function} callback Function (req, res. next) => { } | Middleware
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.use(async (req, res, next) => {
     *     console.log('middleware 1 start')
     *     await next(req, res)
     *     console.log('middleware 1 end')
     * })
     */
    use(callback) {
        this.middlewares.push(new Middleware(callback))
        return this
    }

    /**
     * Use logger
     * @param {Function} callback Function (msg, level) => { } | Logger
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.useLogger((msg, level) => {
     *     // handler...
     * })
     */
    useLogger(callback) {
        this.logger = new Logger(callback)
        return this
    }

    /**
     * Use Cross-Origin Resource Sharing middleware
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.useCors()
     */
    useCors() {
        return this.use(Cors)
    }

    /**
     * Use Session middleware
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.useSession()
     */
    useSession(expires = 1000 * 60 * 30, prefix = '.plankton') {
        return this.use(Session(expires, prefix))
    }

    /**
     * Use path base middleware
     * @param {string} basePath base path
     * @returns {Plankton} Plankton app 
     * 
     * @example
     * app.usePathBase('/api')
     */
    usePathBase(basePath) {
        return this.use(PathBase(basePath))
    }

    /**
     * Use static file middleware
     * @param {string} wwwroot web root path 
     * @param {string} requestPath request base path of static file
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.useStaticFile()
     * 
     * @example
     * app.useStaticFile('static')
     * 
     * @example
     * app.useStaticFile('static', 'static')
     */
    useStaticFile(wwwroot = 'wwwroot', requestPath = '/') {
        return this.use(StaticFile(wwwroot, requestPath))
    }

    /**
     * Use developer error page to show error info
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.useDevErrorPage()
     */
    useDevErrorPage() {
        return this.use(ErrorPage)
    }

    /**
     * Map endpoint
     * @param {string} routePath endpoint path
     * @param {Function} callback (req, res) => { }
     * @param {string} method GET | POST | PUT | ...
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.map('/', (req, res) => {
     *     res.end('hello world')
     * })
     * 
     * @example
     * app.map('/hello', (req, res) => {
     *     res.end('hello world')
     * }, 'GET')
     */
    map(routePath, callback, method = '') {
        routePath = routePath.replaceAll('\\', '/')
        if (routePath.endsWith('/')) routePath = routePath.slice(0, -1)
        routePath += '/?'

        switch (Object.prototype.toString.call(callback)) {

            case '[object AsyncFunction]':
                this.actions.push({
                    path: routePath,
                    invoke: callback,
                    method: method.toLowerCase()
                })
                break

            case '[object Function]':
                this.actions.push({
                    path: routePath,
                    invoke: (req, res) => new Promise((resolve, reject) => {
                        try {
                            callback(req, res)
                            resolve()
                        }
                        catch (err) { reject(err) }
                    }),
                    method: method.toLowerCase()
                })
                break

            default:
                throw 'need [ Function / AsyncFunction ]'
        }

        return this
    }

    /**
     * Map endpoint group
     * @param {string} routePath group base path
     * @param {Function} callback group => { }
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.mapGroup('/api', group => {
     *     group.mapGroup('v1', v1 => {
     *         // curl http://127.0.0.1/api/v1/hello
     *         v1.map('/hello', (req, res) => {
     *              res.end('hello world')
     *         })
     *     })
     * 
     *     // curl http://127.0.0.1/api/about
     *     group.mapGet('/about', (req, res) => {
     *         res.end('about')
     *     })
     * })
     */
    mapGroup(basePath, callback) {
        let group = new Group(basePath)
        callback(group)
        group.routes.forEach(i => this.map(i.path, i.callback))
        return this
    }

    /**
     * Map controller endpoint
     * @param {string} dir controller dir
     * @param {string} basePath controller base path
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.mapController()
     * 
     * @example
     * app.mapController('BlogControllers', '/Blog')
     */
    mapController(dir = 'controllers', basePath = '/') {

        if (!basePath.startsWith('/')) basePath = `/${basePath}`
        let controllerDir = path.join(process.cwd(), 'src', dir)

        fs.readdirSync(controllerDir).forEach(async controllerName => {
            let controllerPath = path.join(controllerDir, controllerName)
            if (fs.lstatSync(controllerPath).isDirectory()) return

            let module = (await import(pathToFileURL(controllerPath).href)).default

            Object.keys(module).forEach(actionName => {
                let routePath = path.join(basePath, controllerName.replace('.js', ''), actionName, '/?')
                this.map(routePath, module[actionName])
            })

            if (module['index']) {
                this.map(path.join(basePath, controllerName.replace('.js', ''), '/?'), module['index'])
            }

            if (controllerName.replace('.js', '') == 'home' && module['index']) {
                this.map(path.join(basePath, '/?'), module['index'])
            }
        })

        return this
    }

    /**
     * Build Plankton app
     * @returns {Plankton} Plankton app
     * 
     * @example
     * app.mapController()
     *     .build()
     */
    build() {
        if (this.hasBuilt) throw 'app has been built'

        this.middlewares.forEach((middleware, index) => {
            if (index >= this.middlewares.length - 1) return
            middleware.next = this.middlewares[index + 1]
        })

        let middleware = new Middleware(async (req, res, _) => {
            await this.#endpoint(req, res)
        })

        let last = this.middlewares.slice(-1).at(0)

        if (!last) {
            this.pipeline = middleware
        }
        else {
            last.next = middleware
            this.pipeline = this.middlewares[0]
        }

        this.hasBuilt = true
        return this
    }

    /**
     * Start Plankton web server
     * @param {number} port listen port number 
     * 
     * @example
     * app.mapController()
     *     .build()
     *     .start()
     * 
     * @example
     * app.mapController()
     *     .build()
     *     .start(5000)
     */
    start(port = 8080) {
        if (!this.pipeline) throw 'need build pipeline'
        this.host = `http://localhost:${port}`

        this.server.listen(port, () => {
            this.logger.log(`server run at ${this.host}`)
        })
    }

    /**
     * Dispose Plankton app
     * @returns {Promise} Dispose Promise
     * 
     * @example
     * await app.dispose()
     */
    dispose() {
        this.logger.log(`dispose server...`)

        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) reject(err)

                this.pipeline = undefined
                this.middlewares = []
                this.actions = []
                this.logger = new Logger()
                this.hasBuilt = false
                this.server = undefined
                this.logger.log(`server has been disposed`)
                resolve()
            })
        })
    }
}
