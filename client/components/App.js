import {h, Component} from 'preact'
import fetch from 'unfetch'

import Sidebar from './Sidebar'
import PropsLoader from './PropsLoader'
import Viewer from './Viewer'
import BusyScreen from './BusyScreen'

export default class App extends Component {
    constructor() {
        super()

        this.state = {
            busy: false,
            current: 0,
            list: [
                {
                    title: 'Onepunch-Man',
                    cover: 'http://l.mfcdn.net/store/manga/11362/cover.jpg?token=14ad73b4d0abc29d49e259119a086b983eabe881&ttl=1503824400&v=1502858890',
                    url: 'http://mangafox.me/manga/onepunch_man/',
                    page: 'http://mangafox.me/manga/onepunch_man/vTBD/c072.5/1.html'
                },
                {
                    title: 'Shingeki no Kyojin',
                    cover: 'http://l.mfcdn.net/store/manga/9011/cover.jpg?token=4b2003653763ff746942b64db0e1d09fef98bde4&ttl=1503838800&v=1502789942',
                    url: 'http://mangafox.me/manga/shingeki_no_kyojin/',
                    page: 'http://mangafox.me/manga/shingeki_no_kyojin/v20/c082/1.html'
                }
            ]
        }
    }

    getManga(url = null) {
        if (url == null) url = this.state.list[this.state.current].url

        if (this.manga != null && this.manga.url === url)
            return Promise.resolve(this.manga)

        return fetch(`./manga/?url=${url}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => this.manga = data)
    }

    getPage(url = null) {
        if (url == null) url = this.state.list[this.state.current].page

        if (this.mangaPage != null && this.mangaPage.url === url)
            return Promise.resolve(this.mangaPage)

        return fetch(`./page/?url=${url}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => this.mangaPage = data)
    }

    handleItemClick = evt => {
        this.setState({current: evt.index})
    }

    handleNextClick = () => {
        this.setState({busy: true})

        this.getPage()
        .then(data => [data, data.pages.findIndex(x => x.id === data.page)])
        .then(([data, index]) => {
            if (index + 1 < data.pages.length) {
                return data.pages[index + 1].url
            }

            return this.getManga()
            .then(manga => [manga, manga.chapters.findIndex(x => x.id === data.chapter)])
            .then(([manga, index]) => {
                if (index + 1 < manga.chapters.length) {
                    return manga.chapters[index + 1].url
                }

                return Promise.reject(new Error('Not found'))
            })
        })
        .then(url => this.setState({
            busy: false,
            list: this.state.list.map((x, i) => i !== this.state.current ? x : {
                ...x,
                page: url
            })
        }))
    }

    handlePreviousClick = () => {
        this.setState({busy: true})

        this.getPage()
        .then(data => [data, data.pages.findIndex(x => x.id === data.page)])
        .then(([data, index]) => {
            if (index - 1 >= 0) {
                return data.pages[index - 1].url
            }

            return this.getManga()
            .then(manga => [manga, manga.chapters.findIndex(x => x.id === data.chapter)])
            .then(([manga, index]) => {
                if (index - 1 >= 0) {
                    return this.getPage(manga.chapters[index - 1].url)
                    .then(data => data.pages.slice(-1)[0].url)
                    .then(url => new Promise(resolve => setTimeout(resolve, 1000, url)))
                }

                return Promise.reject(new Error('Not found'))
            })
        })
        .then(url => this.setState({
            busy: false,
            list: this.state.list.map((x, i) => i !== this.state.current ? x : {
                ...x,
                page: url
            })
        }))
    }

    render() {
        return <div id="root">
            <Sidebar
                list={this.state.list}
                current={this.state.current}
                onItemClick={this.handleItemClick}
            />

            <PropsLoader
                src={this.getPage().then(x => x.src)}
                onPreviousClick={this.handlePreviousClick}
                onNextClick={this.handleNextClick}
            >
                {props => <Viewer {...props} />}
            </PropsLoader>

            <BusyScreen
                show={this.state.busy}
            />
        </div>
    }
}
