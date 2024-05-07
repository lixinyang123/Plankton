import plankton from '@lixinyang123/plankton'

plankton()
    .useSession(10)
    .map('/', (req, res) => {
        res.session.set('hi', 'hello')
        res.end('hello world')
    })
    .map('/test', (req, res) => {
        res.end(req.session.get('hi'))
    })
    .build()
    .start(8080)
