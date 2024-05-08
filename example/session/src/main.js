import plankton from '@lixinyang123/plankton'

plankton()
    .useSession(1000 * 5)
    .map('/', (req, res) => {
        res.session.set('hello', 'world')
        res.end('hello world')
    })
    .map('/test', (req, res) => {
        res.end('hello ' + req.session.get('hello'))
    })
    .build()
    .start(8080)
