const OBA = require('./oba-api.js')
const helper = require('./helpers.js')
const express = require('express')

const tryFrabl = '5F0767EE06F360A0'
require('dotenv').config()

const port = 3000
const data = {
  response: 'Loading results please check terminal for when to refresh'
}
const oba = new OBA({
  key: process.env.PUBLIC
})

oba.getAll('search', {
  q: 'harry potter',
  sort: 'title',
  librarian: true,
  refine: true,
  facet: 'type(book)'
}, 'info')
  .then(res => {
    data.response = res
    console.log(res.length)
  })
  .catch(err => {
    data.response = `${err.response.status} ${err.response.statusText}. See terminal for more details.`
    console.log(err, err.response.status, err.response.statusText)
  })

const app = express()

app.get('/', (req, res) => res.send(data.response))

app.listen(port)
