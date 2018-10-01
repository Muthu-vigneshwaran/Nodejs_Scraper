const {JSDOM} = require('jsdom')
const request = require('request')

const url = 'http://www.hcbombayatgoa.nic.in/aspcaseno.asp'

function getPage () {
  return new Promise((resolve, reject) => {
    request(url, {form: {
      'txttype': 'PILWP',
      'txtno': '2',
      'txtyear': '2010',
    }}, (error, response, html) => {
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
  trs = Array.prototype.slice.call(trs, 0)
  trs = trs.map(tr => { if (tr.textContent.indexOf('table') < 0) { return tr } })
  trs = trs.map(tr => {
    const tds = tr.querySelectorAll('td')
    if (tr.innerHTML.indexOf('table') < 0 && tr.innerHTML.indexOf('option') > -1) {
        const text = tr.textContent.split(/:|\n/gm).map(i => i.trim()).filter(i => i) //tr.textContent.split('\n').map(i => i.trim()).filter(i => i)
        if (text.length === 2 | text.length === 3 | text.length === 6) {
            const key = text[0]
            text.splice(0,1)
            kase[(key)] = text
        }
    }
    if (tds.length === 2 && tr.innerHTML.indexOf('option') < 0 ) {
        const text = tr.textContent.replace(/\s{2,}/gm, ' ').trim()
        if (text.split(/(:-)|:/gm).length === 3) {
            [key, , value] = text.split(/(:-)|:/gm)
            kase[(key)] = value
      }
    }
  })
  console.log(kase)
}