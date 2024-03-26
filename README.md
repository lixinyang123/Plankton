# Plankton

Sample, Fast, Zero Dependency Node.js MVC web framework

### Basic

```javascript
new App().map('/', (req, res) => {
    res.end('hello world')
}).build().start(8080)
```

### Group

```javascript
let app = new App()

app.mapGroup('api', group => {
    group.map('/', (req, res) => {
        res.end('hello world')
    })
})

app.build().start(8080)
```

### Middleware

```javascript
let app = new App()

app.use(async (req, res, next) => {
    console.log('middleware start')
    await next(req, res)
    console.log('middleware end')
})

app.map('/', (req, res) => {
    res.end('hello world')
})

app.build().start(8080)
```

### MVC

- main.js
```javascript
new App()
    .mapController()
    .build()
    .start(8080)
```

- controllers/home.js
```javascript
export default {
    index: async (req, res) => {
        res.render('index.ejs', { action: 'index' })
    },

    about: async (req, res) => {
        res.render('about.ejs', { action: 'about' })
    }
}
```

- views/index.ejs
```html
<body>
    <h1>Hello world from action: <%= action %></h1>
</body>
```

### StaticFile

```javascript
let app = new App()

// map static file
app.use(new StaticFile('wwwroot'))

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

app.build().start(8080)
```

You can view more in the [example](https://github.com/lixinyang123/Plankton/tree/main/example) folder
