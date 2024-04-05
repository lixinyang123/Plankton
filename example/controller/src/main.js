import plankton from '@lixinyang123/plankton'

let app = plankton()

// map controller default
app.mapController()

// map controller in other dir
app.mapController('controllers/apiv1', '/api/v1')

app.build().start(8080)
