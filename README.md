# Functional-programming

---
![visualization](/docs/grouped.png)
## Description

A d3.js project which visualizes the ratio of books per language per publication year in a specific book genre (data from the [OBA API](https://www.oba.nl/)).  
[An example](https://fjvdpol.github.io/functional-programming/renderer/).

## Table of contents

- [Install](#install)
- [Process](#process)
  - [Research](#research)
  - [Research questions](#research-questions)
  - [Final research question](#final-research-question)
  - [Hypothesis](#hypothesis)
  - [Necessary properties](#necessary-properties)
  - [D3](#D3)
- [Visualization](#visualization)
- [Conclusion](#conclusion)
- [To do](#to-do)
- [Credits](#credits/links)

## Install

To install this project you need to do a few things to get up and running. Don't forget it needs the public API key from the [OBA](https://www.oba.nl/).

#### This creates a localhost with all the filtered API data

```bash
# Clone the repository
git clone https://fjvdpol.github.io/functional-programming/renderer/

# Change directory
cd functional-programming

# Create a .env file
touch .env

# Add public key to the .env file
echo "PUBLIC=12345678" >> .env

# Install dependencies
npm install

# Start application
node index.js

```

The application will write the data to a JSON file. If you want to view the project in the browser you will need some way to serve the renderer folder to localhost, otherwise the JSON won't be read since it's being called by a fetch request.

## Process
### Research
I was asked to make a datavisualisation of interesting data from the OBA search API, to find some interesting insights for them.
The first step was to find out what kind of data can be found in the API.
I first tried to browse manually to see what kind of data would be returned. After a while it got annoying to keep changing the url manually, so i started using an [API](https://github.com/rijkvanzanten/node-oba-api) by [rijkvanzanten](https://github.com/rijkvanzanten) which easily outputs the response of the request in your terminal.

Next me and [denniswegereef](https://github.com/denniswegereef) rewrote his API a bit here and there to support multiple requests. This got a little out of hand at the beginning.

By rewriting the API I got a pretty good idea what kind of data could be found in the database, so I started looking for interesting properties.

Eventually I got intrigued by the following properties and endpoints:
```
- publication
- holdings
- coverimage
- language
- writer
- genre
```
With these properties in mind I started formulating some research questions.
### Research  questions
After some time thinking I came up with the following possible interesting research questions:
1. Is there an increase in loaned books a short period after a lot of new books have been added?
  - Which day of the week do a lot of books get added?
  - Which day of the week do most books get loaned?
2. What is the ratio between languages of the books?
 - What about translations?
3. Of bookcovers, what color is most present?
4. What is the trend of the ratio of languages of books in the last 15 years?
  - All books?
  - Ratio languages per publication year
  - Use genre
5. Check the monetary value of a collection of books
 - Possibly using amazon/marktplaats/bol.com scraper
6. What is the trend of the length of summaries of books published in the last 10 years?

### Final research question
After talking about the questions with my fellow students, i eventually settled on the following research question:
```
What is the trend in the ratio of dutch schoolbooks and schoolbooks written in other languages in the last 15 year?
```
A few questions that I found to be necessary to find the anwser to to answer my research question:
- How many books of a specific genre were published in the past 15 year?
- What is the ratio of written original languages per year?

### Hypothesis
I made a hypothesis based on my research question.

**Looking at the past 15 years, books originally written in english will have become the most dominant language in the genre 'school'**

### Needed properties of books
With the question in mind I came up with the necessary properties of books I would need from the data to make my visualization:
- their genre (comes in to play as query when making a request to the api)
- publication > year
- original-language

To make it easier for myself I trimmed the data to only give me what I need for now:
(as found in [index.js](/index.js))

```js
{
  "title": "Het raadsel van de Regenboog / Jacques Vriens",
  "language": "dut",
  "publication": "2001"
}
```
It's pretty easy to change the desired properties so there is room for expanding this visualisation with other properties in the future.

After trimming the data like this I wrote all entries away into a JSON file ([renderer/data.json](/renderer/data.json)).   
On the front end side ([renderer](/renderer/) folder) I read the JSON and then reorder the data so that we end up with an object per language, with an array of years and specific books:

```js
[
 {
   key: "dut",
   values: [
     {
       key: "dut",
       lang: "dut",
       total: 7,
       values: [{.. bookobjects}],
       x: 0,
       y: [0, 7],
       year: 2001
     }
   ]
 }   
]
```
The y value is an array where the first number is the start y coordinate and the second number is the end y coordinate.   
The process of mending the data to include y values was actually one of the most time consuming things since it was hard to decide where to put them and how to calculate them so it would be easy to use with D3.js.

### D3
Now that I had the necessary data I could get into D3.js. It was a first for me working with D3.js, so I had some trouble figuring out the nesting process. I wanted to show the ratio of books per language per year in a stacked bar chart, so i started looking on [observable](https://beta.observablehq.com/) and [bl.ocks.org](https://bl.ocks.org/).
After seeing how some other people made stacked bar charts I had to refactor my code to divide the books per language to draw out instead of languages per year.
Once I was done with this, I found out that it was really hard to calculate the necessary y value for each language rectangle.   
In the end I had to rewrite most of my data mutation functions to accomodate for this issue.   
Scaling, adding x and y axis and grid lines wasn't too hard in the end. Once you get your data structure right, d3 is pretty easy to use for bar charts.
After I finished my first stacked bar chart I refactored it to a grouped bar chart, and render both to the browser.

## Visualization
![visualization grouped](/docs/grouped.png)
![visualization stacked](/docs/stacked.png)

## Conclusion
About the hypothesis: In the end my hypothesis wasn't right. I thought english would've been the most dominant originally written language in school books at the OBA, but it appears that dutch still is the most dominant original written language.    
English is showing a steady grow though, so the future might show a different result.

In the beginning I was more busy with rewriting rijk's API then actually searching for interesting data, which lost me some time but actually learned me alot about promises and functional programming by chaining functions and handling multiple requests and responses at the same time.   
I also learned a lot in the process of reordering data structures, which can be a pain in the ass sometimes. It takes a lot of logging to see what's going on in the reordering process.   
I learned a little bit about D3, mostly the basic functionality. The hardest part was figuring out the stack order.

## To do
- [ ] Cleaning up the code
- [ ] Adding more comments


## Credits/links

[Tim Ruiterkamp](https://github.com/timruiterkamp)
[Dennis Wegereef](https://github.com/denniswegereef)

[Oba API](https://zoeken.oba.nl/api/v1/)
