import {h, Component} from 'preact'
import classNames from 'classnames'

export default class Viewer extends Component {
    constructor() {
        super()

        this.state = {
            zoom: false,
            zoomable: false
        }
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeId)
            this.resizeId = setTimeout(this.updateState, 500)
        })

        document.addEventListener('keyup', evt => {
            if (this.props.loading) return

            if (evt.keyCode === 37) {
                // Left

                let {onPreviousClick = () => {}} = this.props
                onPreviousClick(evt)
            } else if (evt.keyCode === 39) {
                // Right

                let {onNextClick = () => {}} = this.props
                onNextClick(evt)
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.src !== this.props.src) {
            this.setState({
                zoom: false,
                zoomable: false
            })
        }
    }

    updateState = () => {
        if (this.state.zoom) return

        let {width, height} = this.pageElement.getBoundingClientRect()
        let {width: testWidth, height: testHeight} = this.testElement.getBoundingClientRect()

        let zoomable = width !== testWidth || height !== testHeight
        let zoom = !zoomable ? false : this.state.zoom

        this.setState({zoomable, zoom})
    }

    toggleZoom = () => {
        if (this.state.zoomable) {
            this.setState(({zoom}) => ({zoom: !zoom}), () => {
                if (!this.state.zoom) this.updateState()
            })
        }
    }

    handleImageLoad = () => {
        this.updateState()
        this.element.scrollTop = this.element.scrollLeft = 0
    }

    render() {
        return <section
            ref={el => this.element = el}
            id="viewer"
            class={classNames({
                zoom: this.state.zoom,
                zoomable: this.state.zoomable,
                loading: this.props.loading
            })}
        >
            <img
                ref={el => this.pageElement = el}
                class="page"
                src={this.props.src || './img/blank.svg'}

                onClick={this.toggleZoom}
                onLoad={this.handleImageLoad}
            />

            <img
                ref={el => this.testElement = el}
                class="test"
                src={this.props.src || './img/blank.svg'}
            />

            <div class="prev" title="Previous Page" onClick={this.props.onPreviousClick} />
            <div class="next" title="Next Page" onClick={this.props.onNextClick} />
        </section>
    }
}
