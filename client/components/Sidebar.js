import {h, Component} from 'preact'
import classNames from 'classnames'

export default class Sidebar extends Component {
    handleItemClick = evt => {
        let {index} = evt.currentTarget.dataset
        let {onItemClick = () => {}} = this.props

        onItemClick({index: +index})
    }

    handleSelectChapterClick = evt => {
        evt.stopPropagation()

        let {index} = evt.currentTarget.parentNode.dataset
        let {onSelectChapterClick = () => {}} = this.props

        onSelectChapterClick({index: +index})
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
                        <img class="cover" src={item.cover} />
                        <span class="title" title={item.title}>{item.title}</span>

                        <img
                            class="chapters"
                            src="./img/chapters.svg"
                            alt="Select Chapter"
                            title="Select Chapter"
                            onClick={this.handleSelectChapterClick}
                        />
                    </li>
                )}
            </ul>
        </section>
    }
}
