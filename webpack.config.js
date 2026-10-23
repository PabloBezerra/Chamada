const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js',
        clean: true
    },
    devtool:'source-map',
    module:{
        rules:[
            {
                test: /\.js$/i,
                include: path.resolve(__dirname, 'src'),
                type: 'javascript/auto',
              },
            {
                test: /\.s?css$/i,
                use:[MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {url:false}}, 'sass-loader']
            }
        ]
    },
    plugins:[new MiniCssExtractPlugin({filename: 'main.css'})]
}