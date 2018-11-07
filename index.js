const OBA = require('./api/oba-api.js')
const helper = require('./api/helpers.js')
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
oba.getMore(
  [2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017],
  {
    q: 'genre:erotiek'
  })
  .then(response => {
    return response.reduce((total, year) => total.concat(year), [])
    .reduce((total, page) => total.concat(page.aquabrowser.results[0].result), [])
  })
  .then(data => {
    return data.map(book => {return {
      title: book.titles[0].title[0]._,
      publication: helper.getYear(book),
      language: helper.getLanguage(book)
    }})
  })
  .then(data => {

    fs.writeFile("renderer/data.json", JSON.stringify(data) , 'utf-8', (err) => {
      if (err) {
       console.log(err)
      } else {
       console.log("File has been created")
      }
    })
    // app.use(cors())
    // app.get('/', (req, res) => res.json(data))
    // app.listen(port)
  })
  .catch(err => {
    if (err.response) {
      console.log(err.response.status, err.response.statusText)
    } else {
      console.log(err)
    }
  })
