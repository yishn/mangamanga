const path = require('path')
const express = require('express')
const app = express()

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'))
})

app.listen(3000, () => {
    console.log('mangamanga listening on port 3000...')
})
