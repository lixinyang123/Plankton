import plankton from '@lixinyang123/plankton'

plankton().map('/', (req, res) => {
    res.end('hello world')
}).build().start(8080)
