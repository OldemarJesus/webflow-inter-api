require('dotenv').config()
const { default: axios } = require('axios')
const express = require('express')

const app = express()
const PORT = 3000
const WEBFLOW_KEY = process.env.WEBFLOW_ACCESS_TOKEN
const KEY = process.env.KEY
const MARCA_COLLECTION_ID = process.env.MARCA_COLLECTION_ID
const COMBUSTIVEL_COLLECTION_ID = process.env.COMBUSTIVEL_COLLECTION_ID

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Api is running 🥳')
})

app.post('/find-id-by-marca', async (req, res) => {
  const value = req.query.value
  const pkey = req.query.key

  if (pkey !== KEY) return res.status(401).send('Unauthorized');  
  const url = `https://api.webflow.com/collections/${MARCA_COLLECTION_ID}/items?access_token=${WEBFLOW_KEY}`
  const data = await axios.get(url)
  const filteredItems = filterItemByName(data.data.items, value)

  return res.json(filteredItems).status(200)
})

app.post('/find-id-by-combustivel', async (req, res) => {
  const value = req.query.value
  const pkey = req.query.key

  if (pkey !== KEY) return res.status(401).send('Unauthorized');  
  const url = `https://api.webflow.com/collections/${COMBUSTIVEL_COLLECTION_ID}/items?access_token=${WEBFLOW_KEY}`
  const data = await axios.get(url)
  const filteredItems = filterItemByName(data.data.items, value)

  return res.json(filteredItems).status(200)
})

const filterItemByName = (items, value = "") => {
  return items.filter((item) => {
    return item.name.toLowerCase() == value.toLowerCase()
  })
}

app.post('/find-id-by-combustivel', (req, res) => {
  const value = req.params.value
  const pkey = req.params.key

  if (pkey !== KEY) return res.status(401).send('Unauthorized');  


})

// Export the Express API
module.exports = app