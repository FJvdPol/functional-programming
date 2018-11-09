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

const destructData = data => {
  const books = {}

  // group all book objects to their respective publication year
  const publication = d3.nest()
    .key(book => book.publication)
    .entries(data)

  // get array of all the years in the data in string
  books.years = publication.reduce((total, year) => total.concat(Number(year.key)), [])

  // get array of the amount of books per publication year
  books.most = publication.map(year => year.values.length)

  // group all book objects to their language
  books.languages = d3.nest()
      .key(book => book.language)
      .entries(data)
      .reduce((total, lang) => total.concat(lang.key), [])

  // group all books per language per year, calc x and y coordinate
  books.byYear = publication
    .map(year => d3.nest()
      .key(book => book.language)
      .entries(year.values) // group by language per year
      .map(lang => ({...lang, total: lang.values.length})) // get amount of books per language in that year
      .sort((a,b) => b.total - a.total) // a.key.localeCompare(b.key)
      .reduce((total, lang, i) => {
        let base = i == 0 ? 0 : total[i - 1].y[1] // calc y value based on previous language in same year (they need to stack on top of eachoter)
        return total.concat({
          ...lang,
          lang: lang.key,
          year: Number(lang.values[0].publication),
          y: [base, base + lang.total],
          x: i
        })
      }, [])
    )

  // group all to languages
  books.byLang = d3.nest()
    .key(book => book.lang)
    .entries(books.byYear
      .reduce((total, cur) => total.concat(cur))
    )
  console.log(books.byLang)

  // start drawing the data
  drawData(books)
}


const drawData = books => {
  const margin = {top: 40, right: 140, bottom: 40, left: 40}
  const height = window.innerHeight / 1.5
  const width = window.innerWidth
  const bgColor = '#001630'
  const gridLineColor = '#00224a'
  const axisColor = '#003a7d'

  const color = d3.scaleOrdinal()
    .domain(books.byLang)
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), books.byLang.length + 1).reverse())

  const makeGridX = (scale) => d3.axisBottom(scale).ticks(10)

  const makeGridY = (scale) => d3.axisLeft(scale).ticks(10)

  const legend = (chart) => {
    const g = chart
        .attr('transform', `translate(${width - margin.left - 60},${margin.top})`)
      .selectAll('g')
      .data(books.byLang)
      .enter()
      .append('g')
        .attr('font-family', 'sans-serif')
    g.append('rect')
      .attr('fill', (d, i) => color(i))
      .attr('width', 16)
      .attr('height', 16)
      .attr('y', (d, i) => 24 * i)
    g.append('text')
      .attr('fill', axisColor)
      .attr('dy', '0.8em')
      .attr('y', (d, i) => 24 * i)
      .attr('x', 24)
      .text((d, i)=> books.languages[i])
  }




  // ===== Stacked chart ===== //
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(books.most)])
    .rangeRound([height - margin.bottom, margin.top])

  const xScale = d3.scaleBand()
    .domain(books.years)
    .range([margin.left, width - margin.right])

  const xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .attr('color', axisColor)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))

  const yAxis = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .attr('color', axisColor)
    .call(d3.axisLeft(yScale).ticks(null, 's'))

  const stackedChart = d3.select('body')
    .append('svg')
      .style('background', bgColor)
      .attr('width', width)
      .attr('height', height)

  stackedChart.append('g')
      .attr('class', 'grid x')
      .attr('transform', `translate(${xScale.bandwidth() / 2},${height - margin.bottom})`)
      .call(makeGridX(xScale)
          .tickSize(0 - height + margin.top + margin.bottom)
          .tickFormat(''))

  stackedChart.append('g')
      .attr('class', 'grid y')
      .attr('transform', `translate(${margin.left},0)`)
      .call(makeGridY(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(''))

  stackedChart.selectAll('.language-group')
    .attr('class', '.language-group')
    .data(books.byLang)
    .enter().append('g') // every language one group
      .attr('fill', (d, i) => color(i))
    .selectAll('rect')
    .data(d => d.values)
    .enter().append('rect') // every year in language one rect
      .attr('title', d => d.lang)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('x', d => xScale(d.year))
      .attr('y', height - margin.bottom)
      .transition()
        .duration(1000)
        .delay((d, i) => i * 40)
        .attr('height', d => yScale(d.y[0]) - yScale(d.y[1]))
        .attr('y', d => yScale(d.y[1]))

  stackedChart.append('g')
    .call(xAxis)

  stackedChart.append('g')
    .call(yAxis)

  stackedChart.append('g')
    .call(legend)



  // ===== grouped chart ====== //

  // grouped chart y scale
  const yScaleGroup = d3.scaleLinear()
    .domain([0, 100])
    .rangeRound([height - margin.bottom, margin.top])

  // grouped chart x scale
  const xScaleGroup = d3.scaleBand()
    .domain(books.years)
    .range([margin.left, width - margin.right])

  // grouped chart yAxis
  const yAxisGroup = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .attr('color', axisColor)
    .call(d3.axisLeft(yScaleGroup).ticks(null, 's'))

  // grouped chart xAxis
  const xAxisGroup = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .attr('color', axisColor)
    .call(d3.axisBottom(xScaleGroup).tickSizeOuter(0))

  // actual grouped chart svg
  const groupedChart = d3.select('body')
    .append('svg')
      .style('background', bgColor)
      .attr('width', width)
      .attr('height', height)

  groupedChart.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${xScale.bandwidth() / 2},${height - margin.bottom})`)
      .call(makeGridX(xScale)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(''))

  groupedChart.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(makeGridY(yScaleGroup)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(''))

  groupedChart.selectAll('.language-group')
    .data(books.byLang)
    .enter().append('g') // every language one group
      .attr('class', '.language-group')
      .attr('fill', (d, i) => color(i))
    .selectAll('rect')
    .data(d => d.values)
    .enter().append('rect') // every year in language one rect
      .attr('title', d => d.lang)
      .attr('width', xScale.bandwidth() / d3.max(books.byYear.map(year => year.length)))
      .attr('height', 0)
      .attr('x', (d, i) => xScale(d.year) + xScale.bandwidth() / d3.max(books.byYear.map(year => year.length)) * d.x)
      .attr('y', height - margin.bottom)
      .transition()
        .duration(1000)
        .delay((d, i) => i * 40)
        .attr('height', d => yScaleGroup(d.y[0]) - yScaleGroup(d.y[1]))
        .attr('y', d => yScaleGroup(d.y[1] - d.y[0]))

  groupedChart.append('g')
    .call(xAxisGroup)

  groupedChart.append('g')
    .call(yAxisGroup)

  groupedChart.append('g')
    .call(legend)
}
