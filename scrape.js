const axios = require('axios')
const cheerio = require("cheerio")

const url='https://www.coindesk.com/price/bitcoin/'
const currency={name:"", price:"", address:''}

require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const handle = setInterval(scrape, 20000)

async function scrape() {
    const{data} = await axios.get(url)
    const $ = cheerio.load(data)
    const item = $('div.layout-container')

    const price =$(item).find('span.currency-pricestyles__Price-sc-1rux8hj-0').first().text().replace(/[,.]/g,"")
    const priceNum = parseFloat(price)
    console.log(priceNum)
    currency.price = priceNum
    currency.name= `Bitcoin (BTN)`
    currency.address = url
    
    if(priceNum < 5000) {
        client.messages.create ( {
            body: `The value of 1(one) ${currency.name} just fell below $5,000`,
            from : "+17622425614",
            to: "+13127921621"
        }).then(message =>
            clearInterval(handle))
            console.log(message)
    }
   
}
scrape()