const path = require('path')
const express = require('express')
const manga = require('../manga-api')
const app = express()

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'))
})

app.get('/:method(manga|page)', (req, res) => {
    let {url} = req.query

    manga[req.params.method === 'manga' ? 'info' : 'page'](url)
    .then(x => res.json(x))
    .catch(err => res.status(500).json({error: err.message}))
})

app.listen(3000, () => {
    console.log('mangamanga listening on port 3000...')
})
