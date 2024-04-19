import 'zx/globals'
import plankton from '../index.js'
import util from './util.js'

// Test server start

await util.test('Server start', async () => {
    let app = plankton()

    new Promise(() => {
        app.build().start(8080)
    })

    await util.sleep(1000)
    await $`curl -s http://localhost:8080`
    await app.dispose()
})

// Link dependence
await $`yarn link`
await $`yarn link @lixinyang123/plankton`

await util.testExample('example/basic', async () => {
    if ((await $`curl -s http://localhost:8080`) != 'hello world')                              throw 'err'
})

await util.testExample('example/controller', async () => {
    if ((await $`curl -s http://localhost:8080`) != 'hello world')                              throw 'err'
    if ((await $`curl -s http://localhost:8080/home`) != 'hello world')                         throw 'err'
    if ((await $`curl -s http://localhost:8080/home/index`) != 'hello world')                   throw 'err'
    if ((await $`curl -s http://localhost:8080/blog`) != 'blog list')                           throw 'err'
    if ((await $`curl -s http://localhost:8080/blog/index`) != 'blog list')                     throw 'err'
    if ((await $`curl -s http://localhost:8080/about`) != 'about')                              throw 'err'
    if ((await $`curl -s http://localhost:8080/about/index`) != 'about')                        throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v1`) != 'here is api v1')                    throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v1/home`) != 'here is api v1')               throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v1/home/index`) != 'here is api v1')         throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v1/blog`) != 'blog api')                     throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v1/blog/index`) != 'blog api')               throw 'err'
})

await util.testExample('example/cors', async () => {
    let header = await $`curl -sI http://localhost:8080`

    if (header.stdout.includes('Access-Control-Allow-Origin') && 
        header.stdout.includes('Access-Control-Allow-Methods') && 
        header.stdout.includes('Access-Control-Allow-Headers')
    ) return

    throw 'err'
})

await util.testExample('example/group', async () => {
    if ((await $`curl -s http://localhost:8080/api/v1/hi`) != 'request path /api/v1/hi')        throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v1/hello`) != 'request path /api/v1/hello')  throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v2/hi`) != 'request path /api/v2/hi')        throw 'err'
    if ((await $`curl -s http://localhost:8080/api/v2/hello`) != 'request path /api/v2/hello')  throw 'err'
})

await util.testExample('example/middleware', async () => {
    let html = 
        '<p>middleware 1 start</p>' +
        '<p>middleware 2 start</p>' +
        '<p>middleware 3 start</p>' +
        'hello world' +
        '<p>middleware 3 end</p>' +
        '<p>middleware 2 end</p>' +
        '<p>middleware 1 end</p>'

    if ((await $`curl -s http://localhost:8080`) != html)                                       throw 'err'
})

await util.testExample('example/staticfile', async () => {
    await $`curl -s http://localhost:8080`
    await $`curl -s http://localhost:8080/index.html`
    await $`curl -s http://localhost:8080/index.js`
    await $`curl -s http://localhost:8080/test`
    await $`curl -s http://localhost:8080/test/index.html`
    await $`curl -s http://localhost:8080/test/index.js`
})

await util.testExample('example/view', async () => {
    let indexHtml = await $`curl -s http://localhost:8080`
    if (!indexHtml.stdout.includes('Hello world'))                                              throw 'err'

    let homeHtml = await $`curl -s http://localhost:8080/home`
    if (!homeHtml.stdout.includes('>Header<') || !homeHtml.stdout.includes('>Footer<'))         throw 'err'
})

util.report()
