const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const manga = require('../manga-api')
const app = express()

app.use(express.static('static'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'))
})

app.get('/:method(manga|page)', (req, res) => {
    let {url} = req.query

    manga[req.params.method === 'manga' ? 'info' : 'page'](url)
    .then(x => res.json(x))
    .catch(err => res.status(500).json({error: err.message}))
})

app.get('/list', (req, res) => {
    let filepath = path.join(__dirname, 'data.json')

    if (!fs.existsSync(filepath))
        fs.writeFileSync(filepath, JSON.stringify({list: []}))

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({error: err.message})

        res.json(JSON.parse(data))
    })
})

app.post('/list', (req, res) => {
    let filepath = path.join(__dirname, 'data.json')

    fs.writeFile(filepath, JSON.stringify(req.body, null, '  '), () => {
        res.json({status: 'saved'})
    })
})

app.listen(3000, () => {
    console.log('mangamanga listening at http://localhost:3000/...')
})
