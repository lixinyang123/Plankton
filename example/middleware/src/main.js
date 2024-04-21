import plankton from '@lixinyang123/plankton'
import TestMiddleware from './test.js'

let app = plankton()

// create middleware

let middleware = async (req, res, next) => {
    res.write('<p>middleware 1 start</p>')
    await next(req, res)
    res.write('<p>middleware 1 end</p>')
}

app.use(middleware)

// create middleware with lambda

app.use(async (req, res, next) => {
    res.write('<p>middleware 2 start</p>')
    await next(req, res)
    res.write('<p>middleware 2 end</p>')
})

// create middleware with extends

app.use(TestMiddleware)

// map endpoint

app.map('/', (req, res) => {
    res.write('hello world')
})

app.build().start(8080)
