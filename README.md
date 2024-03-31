# Plankton

Sample, Fast, Zero dependency Node.js MVC web framework

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

- src/main.js

```javascript
new App()
    .mapController()
    .build()
    .start(8080)
```

- src/controllers/home.js

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

- src/views/index.ejs

```html
<body>
    <h1>Hello world from action: <%= action %></h1>
</body>
```

### Layout

- src/views/_layout.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
</head>
<body>
    <header>Header</header>
        <%{{ content }}%>
    <footer>Footer</footer>
</body>
</html>
```

- src/views/home/index.ejs

```html
<%{ '../_layout.ejs' }%>

<%{ content %>
    <div>
        <% for (let i = 0; i < 5; i++) { %>
            <h1>Hello <%= world %></h1>
        <% } %>
    </div>
<%} %>
```

- src/main.js

```javascript
new App().map('/', (req, res) => {
    res.render('index.ejs', { world: 'world' })
}).build().start(8080)
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

### Cors

```javascript
new App()
    .use(new Cors())
    .map('/', (req, res) => {
        res.end('hello world')
    }).build().start(8080)
```

You can view more in the [example](https://github.com/lixinyang123/Plankton/tree/main/example) folder
