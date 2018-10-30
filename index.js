const OBA = require('./oba-api.js')
const express = require('express')


require('dotenv').config()

const port = 8080
const data = {
  response: null
}
const oba = new OBA({
  key: process.env.PUBLIC
})

oba.get('holdings/root').then(res => {
  data.response = res
}).catch(err => console.log('error'))




const app = express()

app.get('/', (req, res) => res.json(data.response.aquabrowser))

app.listen(port)
