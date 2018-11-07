const axios = require('axios')
const convert = require('xml-to-json-promise')
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
  // possible endpoints: search (needs a 'q' parameter) | details (needs a 'frabl' parameter) | availability (needs a 'frabl' parameter) | holdings/root (no parameters) | refine (needs a 'rctx' parameter) | index/x (where x = facet type)
  // params: query parameters in object, check api docs for possibilities
  // some unknown parameters: 'q: table:schooltv' 'q: table:activetickets'
  // returns a promise resolving in an array
  get(endpoint, params = {}) {
    const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?authorization=${this.key}${this.stringify(params)}`
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => convert(res.data))
        .then(res => resolve(res.aquabrowser.results[0].result))
    })
  }

  // new version written with dennis
  // possible endpoints: search (needs a 'q' parameter) | holdings/root (no parameters)
  // params: query parameters in object, check api docs for possibilities
  // returns a promise resolving in an array
  getUrls(years, params) {
    const base = 'https://zoeken.oba.nl/api/v1/search/'
    const key = this.key
    const stringify = this.stringify
    return Promise.all(years.map(requestYear))
    function requestYear(year) {
      const all = []
      let page = 1
      return send()
      function send() {
        return axios
          .get(`${base}?authorization=${key}${stringify(params)}&facet=pubYear(${year})&refine=true&page=${page}&pagesize=20`)
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

  getMore(years, params = {}) {
    return new Promise((resolve, reject) => {
      this.getUrls(years, params)
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
