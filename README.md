# koa-undici-proxy

[![Node.js CI](https://github.com/SyaOS/koa-undici-proxy/actions/workflows/ci.yaml/badge.svg)](https://github.com/SyaOS/koa-undici-proxy/actions/workflows/ci.yaml)

Yet another Koa proxy based on [undici](https://undici.nodejs.org/).

## Install

    npm install koa-undici-proxy

or

    yarn add koa-undici-proxy

## Usage

```js
const Koa = require('koa');
const proxy = require('koa-undici-proxy');

const app = new Koa()
app.use(proxy('https://httpbin.org'))

app.listen(3000)

// Now you can access https://httpbin.org/ using http://localhost:3000/
```

## Config

The `proxy()` function also accepts an [undici Client](https://undici.nodejs.org/#/docs/api/Client), so you can use it like:

```js
const Koa = require('koa');
const proxy = require('koa-undici-proxy');
const { Client } = require('undici');

const app = new Koa()
const client = new Client('https://httpbin.org', {
  // I want to proxy big blobs so disable the timeout of receiving body.
  bodyTimeout: 0,
})
app.use(proxy(client))

app.listen(3000)
```

## License

MIT License
