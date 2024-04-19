import plankton from '@lixinyang123/plankton'

let app = plankton()

app.map('/', async (req, res) => {
    await res.render('index.ejs', { world: 'world' })
})

app.map('/home', async (req, res) => {
    await res.render('home.ejs', { world: 'world' })
})

app.build().start(8080)
