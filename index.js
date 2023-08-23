require('dotenv').config()
const { default: axios } = require('axios')
const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const PORT = 3000
const WEBFLOW_KEY = process.env.WEBFLOW_ACCESS_TOKEN
const KEY = process.env.KEY
const MARCA_COLLECTION_ID = process.env.MARCA_COLLECTION_ID
const COMBUSTIVEL_COLLECTION_ID = process.env.COMBUSTIVEL_COLLECTION_ID

// parse application/json
app.use(bodyParser.json())

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Api is running 🥳')
})

app.post('/find-id-by-marca', async (req, res) => {
  try {
    const value = req.body.value
    const pkey = req.body.key

    if (pkey !== KEY) return res.status(401).send('Unauthorized');
    const url = `https://api.webflow.com/collections/${MARCA_COLLECTION_ID}/items?access_token=${WEBFLOW_KEY}`
    const data = await axios.get(url)
    const filteredItems = filterItemByName(data.data.items, value)
    return res.send(filteredItems).status(200)
  } catch (error) {
    return res.status(500).send("Server Error")
  }

})

app.post('/find-id-by-combustivel', async (req, res) => {
  try {
    const value = req.body.value
    const pkey = req.body.key


    if (pkey !== KEY) return res.status(401).send('Unauthorized');
    const url = `https://api.webflow.com/collections/${COMBUSTIVEL_COLLECTION_ID}/items?access_token=${WEBFLOW_KEY}`
    const data = await axios.get(url)
    const filteredItems = filterItemByName(data.data.items, value)
    return res.send(filteredItems).status(200)

  } catch (error) {
    return res.status(500).send(`Server Error: ${error.message}`)
  }
})

const filterItemByName = (items, value = "") => {
  let targetItem = null
  items.forEach(item => {
    if (item.name.toLowerCase() == value.toLowerCase()) {
      targetItem = item
    }
  })

  return targetItem["_id"]
}

// Export the Express API
module.exports = app