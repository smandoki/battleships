const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'docs'),
    }
};