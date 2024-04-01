# Plankton

![NPM Version](https://img.shields.io/npm/v/%40lixinyang123%2Fplankton)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40lixinyang123%2Fplankton)
[![CI](https://github.com/lixinyang123/Plankton/actions/workflows/ci.yml/badge.svg)](https://github.com/lixinyang123/Plankton/actions/workflows/ci.yml)

[Plankton](https://www.npmjs.com/package/@lixinyang123/plankton) is a simple, fast, zero-dependency web framework for Node.js

#### Features

- Simple
- Fast
- Zero-dependency
- Small size
- Support mvc
- Built-in template engine

## Install

This is a [Node.js](https://nodejs.org/) module available through the [npm](https://www.npmjs.com/).

```bash
npm install @lixinyang123/plankton
# or
yarn add @lixinyang123/plankton
```

## Quick Start

You need create a nodejs project first.

```bash
yarn init
yarn add @lixinyang123/plankton
mkdir src
touch src/main.js
```

copy this code to `src/main.js`.

```javascript
import { Plankton } from '@lixinyang123/plankton'

new Plankton()
    .map('/', (req, res) => {
        res.end('hello world')
    })
    .build()
    .start()
```

Finally, you can launch your first web app.

```bash
node src/main.js
curl localhost:8080
```

## Usage

Here are some basic usages,  You can find more in the [example](https://github.com/lixinyang123/Plankton/tree/main/example) folder.

#### Basic

```javascript
new Plankton().map('/', (req, res) => {
    res.end('hello world')
}).build().start(8080)
```

#### Group

```javascript
let app = new Plankton()

app.mapGroup('api', group => {
    group.map('/', (req, res) => {
        res.end('hello world')
    })
})

app.build().start(8080)
```

#### Middleware

```javascript
let app = new Plankton()

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

#### MVC

- src/main.js

```javascript
new Plankton()
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

#### Layout

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
new Plankton().map('/', (req, res) => {
    res.render('index.ejs', { world: 'world' })
}).build().start(8080)
```

#### StaticFile

```javascript
let app = new Plankton()

// map static file
app.useStaticFile()
app.useStaticFile('static', 'test')

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

app.build().start(8080)
```

#### Cors

```javascript
new Plankton()
    .useCors()
    .map('/', (req, res) => {
        res.end('hello world')
    }).build().start(8080)
```

#### Logger

```javascript
new Plankton()
    .useLogger((msg, type) => {
        // handler...
    })
    .map('/', (req, res) => {
        res.end('hello world')
    }).build().start(8080)
```
