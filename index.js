// const OBA = require('oba-api')
const convert = require('xml-to-json-promise');
require('dotenv').config()

// const axios = require('axios')
// let parser = require('xml2js').parseString

const config = {
  public: process.env.PUBLIC,
  secret: process.env.SECRET
}

// const client = new OBA({
//   public: config.public,
//   secret: config.secret
// })
// client.get('search', {
//   q: 'rijk',
//   sort: 'title'
// })
//   .then(res => JSON.parse(res))
//   .then(res => console.log(res.aquabrowser.results.result[0]))
//   .catch(err => console.log(err))

const axios = require('axios');
var parseString = require('xml2js').parseString;


axios.get(`https://zoeken.oba.nl/api/v1/search/?q=boek&authorization=${config.public + ''}`)
  .then(res => {
    return convert.xmlDataToJSON(res.data)
  })
  .then((err, result) => {
    err ? console.log(err) : console.log(result)
  })
  .catch(error => console.log('error: ', error))
