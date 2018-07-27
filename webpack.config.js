const path = require('path')

module.exports = {
    entry: './example/src/index.js',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'example/dist')
    }
}