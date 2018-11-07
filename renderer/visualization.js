function countKeyTotals(arr) {
  return arr.reduce(function(obj, b) {
    obj[b] = ++obj[b] || 1
    return obj
  }, {})
}

// get the data
// const data = fetch('http://localhost:3001')
//   .then(res => res.json())
//   .then(json => destructData(json))
//   .catch(err => console.log(err))

d3.json('data.json').then(data => destructData(data))

function destructData(data){
  const books = {}
  const publication = d3.nest()
    .key(book => book.publication)
    .entries(data)

  const allYears = publication.reduce((total, year) => total.concat(Number(year.key)), [])
  books.years = allYears

  const mostPerYear = publication.map(year => year.values.length)
  books.most = mostPerYear

  const booksByLanguage = d3.nest()
    .key(book => book.language)
    .entries(data)


  books.all = booksByLanguage.map(lang => {
    return {
      lang: lang.key,
      years: d3.nest().key(book => book.publication).entries(lang.values)
    }
  })
  drawData(books)
}


function drawData(books) {

  console.log('x domain: ', d3.extent(books.years))
  console.log('y domain: ', d3.max(books.most))
  console.log(books.all);

  const height = 400
  const width = 400
  const barWidth = 30
  const offset = 5
  const years = 17

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(books.most)])
    .range([0, height])
  const xScale = d3.scaleBand()
    .domain(books.years)
    .range([0, width])
    .paddingInner(.3)
    .paddingOuter(.3)

  const svg = d3.select('body')
    .append('svg')
    .style('background', 'papayawhip')
    .attr('width', width)
    .attr('height', height)

  // console.log(books.all[0].years);
  // svg.selectAll('rect')
  //   .data(books.all[0].years).enter().append('rect')
  //     .attr('fill', 'blue')
  //     .attr('width', xScale.bandwidth())
  //     .attr('height', d => yScale(d.values.length))
  //     .attr('x', d => xScale(Number(d.key)))
  //     .attr('y', d => height - yScale(d.values.length))


  // return
  svg.selectAll('g')
    .data(books.all).enter().append('g') // every language one group
      .selectAll('rect')
        .data(d => d.years).enter().append('rect') // every year in language one rect
          .attr('fill', 'blue')
          .attr('width', xScale.bandwidth())
          .attr('height', d => yScale(d.values.length))
          .attr('x', d => xScale(Number(d.key)))
          .attr('y', (d, index) => {
            return height - yScale(d.values.length)
          })
}
