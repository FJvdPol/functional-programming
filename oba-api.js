const axios = require('axios')
const convert = require('xml-to-json-promise').xmlDataToJSON
const queryToString = require('query-string').stringify

// Based on the oba api by rijkvanzanten

class API {
  constructor(options) {
    // set authentication key dependent on options passed in new OBA instance
    this.key = options.key
  }
  // endpoint: search | details | refine | schema | availability | holdings
  // params: query parameters, check api docs for possibilities
  get(endpoint, params) {
    const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?${queryToString(params)}&authorization=${this.key}`
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => convert(res.data))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
module.exports = API
