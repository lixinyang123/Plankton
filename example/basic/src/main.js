import { App } from '../../../lib/app.js'

new App().map('/', (req, res) => {
    res.end('hello world')
}).build().start(8080)
