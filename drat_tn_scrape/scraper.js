const {JSDOM} = require('jsdom')
const request = require('request')

const url = 'http://www.drat.tn.nic.in/CauseList/2018/011018.htm'

function getPage () {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error) reject()
      resolve(parse(html))
    })
  })
}
getPage()

function parse (html) {
  html = JSDOM.fragment(html)
  const kase = {}
  let trs = html.querySelectorAll('tr')
  trs = Array.prototype.slice.call(trs)
  // console.log(trs);
  let data = trs.map(el => {
    let tds = Array.prototype.slice.call(el.children)
    tdsText = tds.map(a => {
      return a.textContent.replace(/[^A-Za-z0-9- ]+/gim, ' ')
    }).splice(0,5)
    // console.log(tdsText)
    return tdsText
  }).filter(a => a.length === 5)
  data.splice(0,1)
  console.log(structureData(data))
  // structureData(data)
}

function structureData (data) {
  const finalList = []
  let obj = {}
  for (let x of data) {
    obj = {
      slNo: '',
      caseNo: '',
      causeList: '',
      advocateAppellant: '',
      advocateResp: []
    }
    obj.slNo = cleanText(x[0])
    obj.caseNo = cleanText(x[1])
    obj.causeList = cleanText(x[2])
    obj.advocateAppellant = cleanText(x[3])
    obj.advocateResp = parseAdvocate(x[4])
    finalList.push(Object.assign({}, obj))
  }
  return finalList
}

const cleanText = str => str.trim(str)

function parseAdvocate (str) {
  // let advocateRespArray = cleanText(str)
  let advocateRespArray = str.replace(/[R]-((\d[A-Z-]+)|(\s?\d\s?)+|[A-Z]+)/gi, ' ')
                      .replace(/[R]\d((-\d+)+)?|(-)/g, ' ')
                      .replace(/(,\d+)/)
                      .replace(/\s+/g, ' ')
  advocateRespArray = cleanText(advocateRespArray)
  advocateRespArray = advocateRespArray.split().filter(a => a!='')
  // console.log(advocateRespArray)
  return advocateRespArray
}
