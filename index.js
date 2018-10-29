const OBA = require('./oba-api.js')
require('dotenv').config()

const oba = new OBA({
  key: process.env.PUBLIC
})
oba.get('search', {
  q: 'harry potter',
  sort: 'title',
  facet: 'type(book)'
}).then(res => console.log(res))
