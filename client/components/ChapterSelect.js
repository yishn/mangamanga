import {h, Component} from 'preact'
import classNames from 'classnames'

export default class ChapterSelect extends Component {
    render() {
        if (this.props.loading) return <section id="chapter-select"/>

        return <section id="chapter-select">
            <h1>{this.props.title}</h1>

            <img class="close" src="./img/close.svg" alt="Close" onClick={this.props.onCloseClick} />

            <p class="cover"><img src={this.props.cover} alt="Cover" /></p>

            <ul class="info">
                <li><strong>Released:</strong> {this.props.released}</li>
                <li><strong>Authors:</strong> {this.props.authors.join(', ')}</li>
                <li><strong>Artists:</strong> {this.props.artists.join(', ')}</li>
                <li><strong>Genres:</strong> {this.props.genres.join(', ')}</li>
            </ul>

            <div class="summary">
                {this.props.summary.split('\n\n').map(x =>
                    <p>{x}</p>
                )}
            </div>

            <h2>Chapters</h2>

            <ol class="chapters">
                {(this.props.chapters || []).map(chapter =>
                    <li
                        data-id={chapter.id}
                        class={classNames({current: this.props.chapter === chapter.id})}
                    >
                        <strong>{chapter.date}</strong> <em>{chapter.id}</em> {chapter.title}
                    </li>
                ).reverse()}
            </ol>
        </section>
    }
}