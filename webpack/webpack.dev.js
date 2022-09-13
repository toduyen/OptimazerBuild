const { merge } = require('webpack-merge');
const path = require('path');
const commonWebpackConfig = require('./webpack.common');

module.exports = (env) => merge(commonWebpackConfig(env), {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpeg|gif|jpg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ]
    },
    devtool: 'source-map',
    devServer: {
        port: 3005,
        hot: true,
        historyApiFallback: true,
        open: true,
    },
    output: {
        publicPath: '/'
    }
});