import { App } from '../../lib/app.js'

let app = new App()

app.map('/', (req, res) => {
    res.end('hello world')
})

app.mapGroup('/api', group => {
    group.mapGroup('/v1', group => {
        group.map('/hi', (req, res) => {
            res.end('request path /api/v1/hi')
        })

        group.map('/hello', (req, res) => {
            res.end('request path /api/v1/hello')
        })
    })

    group.mapGroup('/v2', group => {
        group.map('/hi', (req, res) => {
            res.end('request path /api/v2/hi')
        })

        group.map('/hello', (req, res) => {
            res.end('request path /api/v2/hello')
        })
    })
})

app.build().start(8080)
