const url = require('url')

const providers = [
    require('./providers/mangafox')
]

let pageCache = {}

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

exports.page = function(url) {
    if (!(url in pageCache)) {
        return createMethod('page')(url).then(result => {
            if (!('error' in result))
                pageCache[url] = result

            return result
        })
    }

    return Promise.resolve(pageCache[url])
}

exports.clearCache = function() {
    pageCache = {}
}
