const OBA = require('oba-api')

require('dotenv').config()

const client = new OBA({
  public: process.env.PUBLIC,
  secret: process.env.SECRET
})

client.get('search', {
  q: 'rijk',
  sort: 'title'
})
  .then(res => console.log(res)) // JSON results
  .catch(err => console.log(err))
