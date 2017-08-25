const {URL} = require('url')
const request = require('request-promise-native')
const {JSDOM} = require('jsdom')

const attr = (obj, attr) => obj == null ? '' : obj[attr]
const headers = {'User-Agent': 'mangamanga'}

exports.search = function(str) {
    return request({url: `http://mangafox.me/search.php?name=${str}&advopts=1`, headers})
    .then(body => new JSDOM(body).window.document)
    .then(document => document.querySelector('#mangalist'))
    .then(listEl => {
        if (listEl == null) {
            return new Promise(resolve => {
                setTimeout(() => resolve(exports.search(str)), 6000)
            })
        }

        return listEl.querySelectorAll('#mangalist .list li')
    })
    .then(liEls => [...liEls].map(li => ({
        url: attr(li.querySelector('a'), 'href'),
        cover: attr(li.querySelector('img'), 'src'),
        completed: li.querySelector('.tag_completed') != null,
        title: attr(li.querySelector('.latest a span'), 'textContent'),
        rating: attr(li.querySelector('.rate'), 'textContent'),
        genres: attr(li.querySelector('.info'), 'title')
            .split(',').map(x => x.trim())
    })))
}

exports.supports = function(url) {
    return new URL(url).hostname.includes('mangafox.com')
}

exports.info = function(url) {
    return request({url, headers})
    .then(body => new JSDOM(body).window.document)
    .then(document => ({
        querySelector: x => document.querySelector(x),
        querySelectorAll: x => [...document.querySelectorAll(x)],
        title: attr(document.querySelector('.cover img'), 'alt')
    }))
    .then(({querySelector, querySelectorAll, title}) => ({
        url, title,
        cover: attr(querySelector('.cover img'), 'src'),
        released: attr(querySelector('#title a[href*="released"]'), 'textContent'),
        authors: querySelectorAll('#title a[href*="author"]')
            .map(a => a.textContent),
        artists: querySelectorAll('#title a[href*="artist"]')
            .map(a => a.textContent),
        genres: querySelectorAll('#title a[href*="genres"]')
            .map(a => a.textContent),
        summary: attr(querySelector('.summary'), 'textContent'),
        chapters: querySelectorAll('.chlist li').map(li => ({
            date: attr(li.querySelector('.date'), 'textContent'),
            url: attr(li.querySelector('.tips'), 'href'),
            id: attr(li.querySelector('.tips'), 'textContent')
                .replace(title, '').trim(),
            title: attr(li.querySelector('.title'), 'textContent')
        }))
    }))
}

exports.chapter = function(url) {
    return request({url, headers, gzip: true})
    .then(body => new JSDOM(body).window.document)
    .then(document => ({
        querySelector: x => document.querySelector(x),
        querySelectorAll: x => [...document.querySelectorAll(x)],
        t: attr(document.querySelector('#tip strong'), 'textContent')
    }))
    .then(({querySelector, querySelectorAll}) => ({
        url,
        mangaUrl: attr(querySelector('#series strong a'), 'href'),
        id: attr(querySelector('#series h1 a'), 'textContent')
            .replace(
                attr(querySelector('#series strong a'), 'textContent').replace('Manga', '').trim(),
                ''
            ).trim(),
        title: t.slice(t.indexOf(':') + 1).trim(),
        pages: querySelectorAll('#top_chapter_list + * select option')
            .filter(option => option.value !== '0')
            .map(option => ({
                id: option.value,
                url: url.slice(0, -[...url].reverse().indexOf('/')) + `${option.value}.html`,
                get() {
                    if (option.selected)
                        return Promise.resolve(attr(querySelector('#viewer img'), 'src'))

                    return request({url: this.url, headers, gzip: true})
                        .then(body => new JSDOM(body).window.document)
                        .then(document => attr(document.querySelector('#viewer img'), 'src'))
                }
            }))
    }))
}
