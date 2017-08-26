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
                        <img src={item.cover} alt="Cover" />
                        <span title={item.title}>{item.title}</span>
                    </li>
                )}
            </ul>
        </section>
    }
}
