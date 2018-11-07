const OBA = require('./oba-api.js')
const helper = require('./helpers.js')
const express = require('express')
const jp = require('jsonpath')
const fs = require('fs')
const cors = require('cors')

const randomBookFrabl = '74B4F2FC98F360A7'
require('dotenv').config()

const app = express()
const port = 3001
const oba = new OBA({
  key: process.env.PUBLIC
})

// oba.getAll('search', {
//   q: 'genre:sciencefiction',
//   librarian: true,
//   refine: true,
//   facet: 'type(book)'
// })
oba.getLocal()
  .then(data => {
    // alleen laatste tien jaar
    return data.filter(book => book.publication[0].year[0]['_'] > 1997)
  })
  .then(data => {
    const booksByYears = []
    // maak array met alle boeken per jaar afgelopen twintig jaar
    for (let year = 1997; year < 2017; year++) {
      const booksPerYear = data.filter(book => book.publication[0].year[0]['_'] == year)
      const booksToLanguages = booksPerYear.map(book => book.languages[0]['original-language'] ? book.languages[0]['original-language'][0]['_'] : book.languages[0]['language'][0]['_'])
      const languagesPerYear = Object.keys(helper.countKeyTotals(booksToLanguages))
      const booksPerLanguage = languagesPerYear.map((lang, index) => {
        return {
          language: lang,
          books: booksPerYear.filter(book => book.languages[0]['original-language'] ? book.languages[0]['original-language'][0]['_'] == lang : book.languages[0]['language'][0]['_'] == lang)
        }
      })
      if (booksPerYear.length > 0){
        booksByYears.push({
          year: year,
          booksByLanguage: booksPerLanguage
        })
      }
    }
    return booksByYears
    // const key = 'publication'
    // return key ? jp.query(res, '$..' + key) : res
  })
  .then(data => {
    app.use(cors())
    app.get('/', (req, res) => res.json(data))
    app.listen(port)
  })
  .catch(err => {
    if (err.response) {
      console.log(err.response.status, err.response.statusText)
    } else {
      console.log(err)
    }
  })
