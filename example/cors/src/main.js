import { App } from '../../../lib/app.js'
import { Cors } from '../../../lib/middleware/cors.js'

new App()
    .use(new Cors())
    .map('/', (req, res) => {
        res.end('hello world')
    }).build().start(8080)
