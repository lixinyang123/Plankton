import { Plankton, Middleware } from '@lixinyang123/plankton'
import { Test } from './test.js'

let app = new Plankton()

// create middleware

let middleware = new Middleware(async (req, res, next) => {
    console.log('middleware 1 start')
    await next(req, res)
    console.log('middleware 1 end')
})

app.use(middleware)

// create middleware with lambda

app.use(async (req, res, next) => {
    console.log('middleware 2 start')
    await next(req, res)
    console.log('middleware 2 end')
})

// create middleware with extends

app.use(new Test())

// map endpoint

app.map('/', (req, res) => {
    res.end('hello world')
})

app.build().start(8080)
