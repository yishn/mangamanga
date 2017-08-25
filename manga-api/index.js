const providers = [
    require('./providers/mangafox')
]

exports.search = function(str) {
    return Promise.all(providers.map(x => x.search(str)))
        .then(res => res.reduce((acc, x) => (acc.push(...x), acc), []))
        .then(res => res.sort((x, y) => x.title < y.title ? -1 : +(x.title === y.title)))
}

let createMethod = method => function(url) {
    let provider = providers.find(x => x.supports(url))
    if (provider == null) return null

    return provider[method](url)
}

exports.info = createMethod('info')

exports.chapter = createMethod('chapter')
