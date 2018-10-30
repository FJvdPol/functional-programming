module.exports = {
  countKeyTotals(arr) {
    return arr.reduce(function(obj, b) {
      obj[b] = ++obj[b] || 1
      return obj
    }, {})
  }
}
