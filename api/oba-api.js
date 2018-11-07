const axios = require('axios')
const convert = require('xml-to-json-promise').xmlDataToJSON
const fs = require('fs')

// Based on the oba api by rijkvanzanten

class API {
  constructor(options) {
    // set authentication key dependent on options passed in new OBA instance
    this.key = options.key
  }
  // parameters will be passed to API.get as an object, so we need to turn the object into a query string
  stringify(object) {
    const keys = Object.keys(object)
    const values = Object.values(object)
    return keys.map((key, i) => `&${key}=${values[i]}`).join('')
  }
  // possible endpoints: search (needs a 'q' parameter) | holdings/root (no parameters)
  // params: query parameters in object, check api docs for possibilities
  // returns a promise resolving in an array
  getAll(endpoint, params = {}, key) {
    const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?authorization=${this.key}${this.stringify(params)}`
    console.log(url)
    return this.getRequestFunctions(url)
      .then(requests => {
        return axios.all(requests)
          .then(axios.spread((...responses) => {
            const json = responses.map((res) => convert(res.data))
            return Promise.all(json)
          }))
          .then(res => res.map(obj => obj.aquabrowser.results[0].result))
          .then(res => [].concat(...res))
      })
  }
  getLocal() {
    return new Promise((resolve, reject) => {
      fs.readFile(__dirname + '/sciencefiction.json', 'utf-8', (err, data) => {
        err ? reject(err) : false
        const json = JSON.parse(data)
        const result = json.map(obj => obj.aquabrowser.results[0].result)
        resolve([].concat(...result))
      })
    })
  }
  // possible endpoints: search (needs a 'q' parameter) | details (needs a 'frabl' parameter) | availability (needs a 'frabl' parameter) | holdings/root (no parameters) | refine (needs a 'rctx' parameter) | index/x (where x = facet type)
  // params: query parameters in object, check api docs for possibilities
  // some unknown parameters: 'q: table:schooltv' 'q: table:activetickets'
  // returns a promise resolving in an array
  get(endpoint, params = {}, key) {
    const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?authorization=${this.key}${this.stringify(params)}`
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => convert(res.data))
        .then(res => res.aquabrowser.results[0].result)
        .then(res => resolve(res))
    })
  }
  getAmountOfRequests(url) {
    return axios.get(url)
      .then(res => convert(res.data))
      .then(res => (Math.ceil(res.aquabrowser.meta[0].count[0] / 20) + 1))
  }
  getRequestFunctions(url) {
    return this.getAmountOfRequests(url).then(amount => {
      const promises = []
      amount > 20 ? amount = 20 : false
      for (let i = 1; i < amount; i++) {
        promises.push(axios.get(`${url}&page=${i}`))
      }
      return promises
    })
  }


   // new version written with dennis
  getUrls(years) {
    const base = 'https://zoeken.oba.nl/api/v1/search/'
    const publicKey = '1e19898c87464e239192c8bfe422f280'

    return Promise.all(years.map(requestYear))

    function requestYear(year) {
      const all = []
      let page = 1

      return send()

      function send() {
        return axios
          .get(`${base}?authorization=${publicKey}&q=genre:erotiek&facet=pubYear(${year})&refine=true&page=${page}&pagesize=1`)
          .then(res => res.data)
          .then(convert.xmlDataToJSON)
          .then(next, console.error)
          .then(res => {
            if (res) {
              return res
            }
        })
      }

      function next(aantalBoeken) {
        all.push(aantalBoeken)
        let amountOfPages = Math.ceil(aantalBoeken.aquabrowser.meta[0].count[0] / 20)

        if (page < amountOfPages) {
          page++
          return send()
        } else {
          return all
        }
      }
    }
  }

  getMore(endpoint = '', params = '', years) {
    return new Promise((resolve, reject) => {

      this.getUrls(years)
      .then(response => {
        console.log(response);


        resolve(response)
      })
      .catch(err => {
        console.log(err)
      })
    })
  }
}
module.exports = API
