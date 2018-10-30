const axios = require('axios')
const convert = require('xml-to-json-promise').xmlDataToJSON
// Based on the oba api by rijkvanzanten

class API {
  constructor(options) {
    // set authentication key dependent on options passed in new OBA instance
    this.key = options.key
    console.log(this.stringify({name: 'folkert', value: 'true', hello: 'hello'}));
  }
  stringify(object) {
    const keys = Object.keys(object)
    const values = Object.values(object)
    return keys.map((key, i) => `&${key}=${values[i]}`).join('')
  }
  // endpoint: search | details | refine | schema | availability | holdings
  // params: query parameters, check api docs for possibilities
  get(endpoint, params = {}) {
    const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?authorization=${this.key}${this.stringify(params)}`
    console.log(url);
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => convert(res.data))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
module.exports = API
