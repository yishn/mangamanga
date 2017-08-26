import {h, Component} from 'preact'
import classNames from 'classnames'

export default class BusyScreen extends Component {
    render() {
        return <section id="busy-screen" class={classNames({show: this.props.show})} />
    }
}
