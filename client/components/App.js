import {h, Component} from 'preact'
import Sidebar from './Sidebar'
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
                    chapter: 'http://mangafox.me/manga/onepunch_man/v13/c069/1.html'
                },
                {
                    title: 'Shingeki no Kyojin',
                    cover: 'http://l.mfcdn.net/store/manga/9011/cover.jpg?token=4b2003653763ff746942b64db0e1d09fef98bde4&ttl=1503838800&v=1502789942',
                    url: 'http://mangafox.me/manga/shingeki_no_kyojin/',
                    chapter: 'http://mangafox.me/manga/shingeki_no_kyojin/v20/c082/1.html'
                }
            ]
        }
    }

    handleItemClick = evt => {
        this.setState({current: evt.index})
    }

    render() {
        return <div id="root">
            <Sidebar
                list={this.state.list}
                current={this.state.current}
                onItemClick={this.handleItemClick}
            />

            <Viewer
                src="http://l.mfcdn.net/store/manga/11362/13-068.0/compressed/u005.jpg?token=8de476a01cfb259e5ac6439107728b9a9196c3b3&ttl=1503824400"
            />

            <BusyScreen
                show={this.state.busy}
            />
        </div>
    }
}
