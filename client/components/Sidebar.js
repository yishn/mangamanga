import {h, Component} from 'preact'
import classNames from 'classnames'

export default class Sidebar extends Component {
    handleItemClick = evt => {
        let {index} = evt.currentTarget.dataset
        let {onItemClick = () => {}} = this.props

        onItemClick({index: +index})
    }

    render() {
        return <section id="sidebar">
            <ul>
                {this.props.list.map((item, i) =>
                    <li
                        data-index={i}
                        class={classNames({current: this.props.current === i})}
                        onClick={this.handleItemClick}
                    >
                        <img class="cover" src={item.cover} alt="Cover" />
                        <span class="title" title={item.title}>{item.title}</span>
                        <img class="chapters" src="./img/chapters.svg" alt="Chapters" title="Select Chapter" />
                    </li>
                )}
            </ul>
        </section>
    }
}
