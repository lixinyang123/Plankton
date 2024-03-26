import { App } from '../../../lib/app.js'
import { StaticFile } from '../../../lib/middleware/staticfile.js'

let app = new App()

// use static file
// default is src/wwwroot
app.use(new StaticFile())

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

app.build().start(8080)
