import {h, Component} from 'preact'

export default class PropsLoader extends Component {
    constructor(props) {
        super(props)

        this.state = {loading: true}

        this.componentWillReceiveProps(props)
    }

    componentWillReceiveProps(nextProps) {
        this.state = {}
        this.setState({loading: true})

        let keys = Object.keys(nextProps)
            .filter(x => x !== 'children' && nextProps[x] !== this.state[x])
        let promises = keys.map(key => Promise.resolve(nextProps[key]))

        Promise.all(promises)
        .then(values => keys.forEach((key, i) => this.setState({[key]: values[i]})))
        .then(() => this.setState({loading: false}))
    }

    render() {
        return this.props.children[0](this.state)
    }
}
