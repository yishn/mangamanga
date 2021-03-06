const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: './client/index.js',

    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'static', 'js')
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                query: {
                    presets: [['env', {modules: false}], 'stage-1'],
                    plugins: [['transform-react-jsx', {pragma: 'h'}]]
                }
            }
        ]
    },

    resolve: {
        alias: {
            'preact': path.join(__dirname, 'node_modules/preact/dist/preact.min')
        }
    }
}
