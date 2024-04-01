import { Plankton } from '@lixinyang123/plankton'

let app = new Plankton()

// use static file
// default is src/wwwroot
app.useStaticFile()

app.useStaticFile('static', 'test')

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

app.build().start(8080)
