import { Plankton } from '@lixinyang123/plankton'

new Plankton()
    .useCors()
    .map('/', (req, res) => {
        res.end('hello world')
    }).build().start(8080)
