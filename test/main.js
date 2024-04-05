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
    console.log('\n')
    await app.dispose()
})

await util.test('Basic server', async () => {
    await $`echo 'Run basic server example'`
})

util.report()
