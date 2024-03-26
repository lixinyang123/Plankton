import { App } from '../../../lib/app.js'

let app = new App()

// map controller default
app.mapController()

// map controller in other dir
app.mapController('controllers/apiv1', '/api/v1')

app.build().start(8080)
