import path from 'path'

export class Group {
    constructor(basePath) {
        if (!basePath.startsWith('/')) basePath = '/' + basePath
        this.basePath = basePath
        this.routes = []
    }

    /**
     * Map endpoint
     * @param {string} routePath endpoint path
     * @param {Function} callback (req, res) => { }
     * @param {string} method GET | POST | PUT | ...
     * @returns {Plankton} Plankton app
     * 
     * @example
     * group.map('/', (req, res) => {
     *     res.end('hello world')
     * })
     * 
     * @example
     * group.map('/hello', (req, res) => {
     *     res.end('hello world')
     * }, 'GET')
     */
    map(routePath, callback, method = '') {
        this.routes.push({
            path: path.join(this.basePath, routePath),
            callback: callback,
            method: method.toLowerCase()
        })
    }

    /**
     * Map endpoint group
     * @param {string} routePath group base path
     * @param {Function} callback group => { }
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
        if (!basePath.startsWith('/')) basePath = '/' + basePath
        let group = new Group(basePath)

        callback(group)
        group.routes.forEach(i => this.map(i.path, i.callback))
    }
}
