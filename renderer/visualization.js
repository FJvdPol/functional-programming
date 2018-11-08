function countKeyTotals(arr) {
  return arr.reduce((obj, key) => {
    obj[key] = ++obj[key] || 1
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
  const language = d3.nest()
      .key(book => book.language)
      .entries(data)

  books.languages = language.reduce((total, lang) => total.concat(lang.key), [])

  books.years = publication.reduce((total, year) => total.concat(Number(year.key)), [])

  books.most = publication.map(year => year.values.length)

  const stack = d3.stack()
    .keys(books.languages)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)

  books.byYear = publication
    .map(year => d3.nest()
        .key(book => book.language)
        .entries(year.values)
        .map(lang => ({...lang, total: lang.values.length}))
        .sort((a,b) => b.total - a.total) // a.key.localeCompare(b.key)
        .reduce((total, lang, index) => {
          let base
          index == 0 ? base = 0 : base = total[index - 1].y[1]
          return total.concat({...lang, lang: lang.key, year: lang.values[0].publication, y: [base, base + lang.total]})
        }, [])
    )

    // .map(year =>
    //   year.reduce((total, lang) => {
    //     total[lang.key] = lang.values.length
    //     return total
    //   }, {})
    // )
    // .map(langArr => ({y: langArr.slice(0,2), year: langArr.data.values[0].publication, lang: langArr.data.key, ...langArr.data}))
    // .reduce((arr, cur) => arr.concat(cur), [])


  console.log('booksByYear: ',books.byYear)

  books.byLang = d3.nest()
    .key(book => book.lang)
    .entries(books.byYear
      .reduce((total, cur) => total.concat(cur))
    )

  drawData(books)
}


function drawData(books) {
  console.log('x domain: ', d3.extent(books.years))
  console.log('y domain: ', d3.max(books.most))
  // console.log(books.byLang);


  const margin = ({top: 10, right: 10, bottom: 20, left: 40})
  const height = window.innerHeight / 1.5
  const width = window.innerWidth
  const barWidth = 30
  const offset = 5
  // const years = books.years.length

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(books.most)])
    .rangeRound([height - margin.bottom, margin.top])
  const xScale = d3.scaleBand()
    .domain(books.years)
    .range([margin.left, width - margin.right])
    .padding(.1, 0)

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())



  const color = d3.scaleLinear().domain([1, books.byLang.length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')])


  const svg = d3.select('body')
    .append('svg')
    .style('background', 'papayawhip')
    .attr('width', width)
    .attr('height', height)

  svg.selectAll('g')
    .data(books.byLang).enter().append('g') // every language one group
    .attr('fill', (d, index) => color(index))
      .selectAll('rect')
        .data(d => d.values).enter().append('rect') // every year in language one rect
          .attr('width', xScale.bandwidth())
          .attr('height', d => yScale(d.y[0]) - yScale(d.y[1]))
          .attr('title', d => d.lang)
          .attr('x', d => xScale(Number(d.year)))
          .attr('y', d => yScale(d.y[1]) )

  svg.append("g")
      .call(xAxis)

  svg.append("g")
      .call(yAxis)
}
