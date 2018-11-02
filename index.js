const OBA = require('./oba-api.js')
const helper = require('./helpers.js')
const express = require('express')
const jp = require('jsonpath')

const randomBookFrabl = '74B4F2FC98F360A7'
require('dotenv').config()

const app = express()
const port = 3000
const oba = new OBA({
  key: process.env.PUBLIC
})

oba.getAll('search', {
  q: 'genre:sciencefiction',
  librarian: true,
  refine: true,
  facet: 'type(book)'
})
  .then(res => {
    const key = ''
    return key ? jp.query(res, '$..' + key) : res
  })
  .then(data => {
    const lastTenYears = data.filter(book => book.publication[0].year[0]['_'] > 2016)
    console.log(lastTenYears.length, data.length)
    app.get('/', (req, res) => res.send(lastTenYears))
    app.listen(port)
  })
  .catch(err => {
    if (err.response) {
      console.log(err.response.status, err.response.statusText)
    } else {
      console.log(err)
    }
  })
