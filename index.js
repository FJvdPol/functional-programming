const OBA = require('./oba-api.js')
const express = require('express')

const tryFrabl = '5F0767EE06F360A0'
require('dotenv').config()

const port = 3000
const data = {
  response: null
}
const oba = new OBA({
  key: process.env.PUBLIC
})

oba.get('search', {
  q: 'harry potter',
  sort: 'title'
}, 'title')
  .then(res => {
    data.response = res
    console.log(res.length)
  })
  .catch(err => console.log('error', err))

const app = express()

app.get('/', (req, res) => res.send(data.response))

app.listen(port)
