const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './js/app.js',
    mode: 'development',
    output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
    },
    module: {
    rules: [
        {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
        },
        {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        }
    ]
    },
    plugins: [
    new HtmlWebpackPlugin({
        template: './index.html'
    })
    ],
    devServer: {
    static: [
        {
        directory: __dirname + '/dist',
        },
        {
        directory: __dirname,
        publicPath: '/',
        }
    ],
    port: 3000,
    open: true
    }
};