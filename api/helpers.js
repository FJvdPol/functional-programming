module.exports = {
  countKeyTotals(arr) {
    return arr.reduce(function(obj, b) {
      obj[b] = ++obj[b] || 1
      return obj
    }, {})
  },
  getMainKey(objArr){
    return objArr.map(array => array[0]['_'] ? array[0]['_'] : array[0])
  },
  getLanguage(book) {
    return book.languages[0][`${book.languages[0]['original-language'] ? 'original-language' : 'language'}`][0]._
  },
  getYear(book) {
    return book.publication[0].year[0]._
  }

}
