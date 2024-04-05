import plankton from '@lixinyang123/plankton'

let app = plankton()

// use static file
// default is src/wwwroot
app.useStaticFile()

app.useStaticFile('static', 'test')

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

app.build().start(8080)
