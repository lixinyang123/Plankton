import 'zx/globals'
import { App } from '../lib/app.js'
import util from './util.js'

// Test server start

await util.test('Server start', async () => {
    let app = new App()

    new Promise(() => {
        app.build().start(8080)
    })

    await util.sleep(1000)
    await $`curl -s http://localhost:8081`
    console.log('\n')
    await app.dispose()
})

await util.test('Basic server', async () => {
    await $`echo 'Run basic server example'`
})

util.report()
