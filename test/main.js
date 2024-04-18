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
    let output = await $`curl -s http://localhost:8080`
    if (output != 'hello world') throw 'err'
})

await util.testExample('example/controller', async () => {
    await $`curl -s http://localhost:8080`
    await $`curl -s http://localhost:8080/home`
    await $`curl -s http://localhost:8080/home/index`
    await $`curl -s http://localhost:8080/blog`
    await $`curl -s http://localhost:8080/blog/index`
    await $`curl -s http://localhost:8080/about`
    await $`curl -s http://localhost:8080/about/index`
    await $`curl -s http://localhost:8080/api/v1`
    await $`curl -s http://localhost:8080/api/v1/home`
    await $`curl -s http://localhost:8080/api/v1/home/index`
    await $`curl -s http://localhost:8080/api/v1/blog`
    await $`curl -s http://localhost:8080/api/v1/blog/index`
})

util.report()
