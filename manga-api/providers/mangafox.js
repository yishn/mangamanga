const path = require('path').posix
const {URL} = require('url')
const normalizeUrl = require('normalize-url')
const request = require('request-promise-native')
const {JSDOM} = require('jsdom')

const attr = (obj, attr) => obj == null ? '' : obj[attr]

function customRequest(url, options = {}) {
    return request(Object.assign({
        url,
        headers: {'User-Agent': 'mangamanga'},
        rejectUnauthorized: false
    }, options))
}

exports.search = function(str) {
    return customRequest(`http://mangafox.me/search.php?name=${str}&advopts=1`)
    .then(body => new JSDOM(body).window.document)
    .then(document => [...document.querySelector('#mangalist .list li')])
    .then(liEls => liEls.map(li => ({
        url: normalizeUrl(attr(li.querySelector('a'), 'href')),
        cover: normalizeUrl(attr(li.querySelector('img'), 'src')),
        completed: li.querySelector('.tag_completed') != null,
        title: attr(li.querySelector('.latest a span'), 'textContent'),
        rating: attr(li.querySelector('.rate'), 'textContent'),
        genres: attr(li.querySelector('.info'), 'title')
            .split(',').map(x => x.trim())
    })))
}

exports.supports = function(url) {
    return new URL(url).hostname.includes('mangafox')
}

exports.info = function(url) {
    return customRequest(url)
    .then(body => new JSDOM(body).window.document)
    .then(document => ({
        querySelector: x => document.querySelector(x),
        querySelectorAll: x => [...document.querySelectorAll(x)],
        title: attr(document.querySelector('.cover img'), 'alt')
    }))
    .then(({querySelector, querySelectorAll, title}) => ({
        url, title,
        cover: normalizeUrl(attr(querySelector('.cover img'), 'src')),
        released: attr(querySelector('#title a[href*="released"]'), 'textContent'),
        authors: querySelectorAll('#title a[href*="author"]')
            .map(a => a.textContent),
        artists: querySelectorAll('#title a[href*="artist"]')
            .map(a => a.textContent),
        genres: querySelectorAll('#title a[href*="genres"]')
            .map(a => a.textContent),
        summary: attr(querySelector('.summary'), 'textContent'),
        chapters: querySelectorAll('.chlist li').map(li => (url => ({
            date: attr(li.querySelector('.date'), 'textContent'),
            url: normalizeUrl(url.slice(-6) === '1.html' ? url
                : path.join(url, '1.html').replace('http:/', 'http://')),
            id: attr(li.querySelector('.tips'), 'textContent')
                .replace(title, '').trim(),
            title: attr(li.querySelector('.title'), 'textContent')
        }))(attr(li.querySelector('.tips'), 'href'))).reverse()
    }))
}

exports.page = function(url) {
    return customRequest(url, {gzip: true})
    .then(body => new JSDOM(body).window.document)
    .then(document => ({
        querySelector: x => document.querySelector(x),
        querySelectorAll: x => [...document.querySelectorAll(x)],
        t: attr(document.querySelector('#tip strong'), 'textContent')
    }))
    .then(({querySelector, querySelectorAll, t}) => ({
        url,
        mangaUrl: normalizeUrl(attr(querySelector('#series strong a'), 'href')),
        chapter: attr(querySelector('#series h1 a'), 'textContent')
            .replace(
                attr(querySelector('#series strong a'), 'textContent').replace('Manga', '').trim(),
                ''
            ).trim(),
        chapterTitle: t.slice(t.indexOf(':') + 1).trim(),
        src: normalizeUrl(attr(querySelector('#viewer img'), 'src')),
        page: attr(querySelector('#top_chapter_list + * select option[selected]'), 'value'),
        pages: querySelectorAll('#top_chapter_list + * select option')
            .filter(option => option.value !== '0')
            .map(option => ({
                id: option.value,
                url: normalizeUrl(path.join(url, `../${option.value}.html`).replace('http:/', 'http://'))
            }))
    }))
}
