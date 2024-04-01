import { Plankton } from '@lixinyang123/plankton'

new Plankton().map('/', (req, res) => {
    res.end('hello world')
}).build().start(8080)
