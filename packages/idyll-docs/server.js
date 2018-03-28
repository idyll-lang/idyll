// server.js
const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
const uuid = require('uuid/v4');
const express = require('express')
const bodyParser = require('body-parser')
const { parse } = require('url')

const {createServer} = require('http');
app.prepare().then(() => {
    // Express config
    const server = express();
    server.use(bodyParser.json());

    server.get('*', (req, res) => {
      req.url = req.url.replace(/\/$/, "")
      if (req.url == "") { req.url = "/" }
      handler(req, res)
    })

    server.listen(3000)
  })
