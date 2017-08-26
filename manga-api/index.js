const providers = [
    require('./providers/mangafox')
]

let chapterCache = {}

exports.search = function(str) {
    return Promise.all(providers.map(x => x.search(str)))
    .then(res => res.reduce((acc, x) => (acc.push(...x), acc), []))
    .then(res => res.sort((x, y) => x.title < y.title ? -1 : +(x.title === y.title)))
}

let createMethod = method => function(url) {
    let provider = providers.find(x => x.supports(url))
    if (provider == null) return Promise.reject(new Error('Not found'))

    return provider[method](url)
}

exports.info = createMethod('info')

exports.chapter = function(url) {
    if (!(url in chapterCache)) {
        let result = createMethod('chapter')(url)
        chapterCache[url] = result
    }

    return chapterCache[url]
}

exports.clearCache = function() {
    chapterCache = {}
}
