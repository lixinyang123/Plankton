import { App } from '../../../lib/app.js'

let app = new App()

app.map('/', (req, res) => {
    res.render('index.ejs', { world: 'world' })
})

app.map('/home', (req, res) => {
    res.render('home.ejs', { world: 'world' })
})

app.build().start(8080)
