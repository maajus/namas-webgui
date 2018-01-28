var webpack = require('webpack');

process.env.NODE_ENV = 'production'

module.exports = {
  context: __dirname,
  entry: "./dist/www/js/site.js",
    module: {
                loaders: [
                    { test: /\.css$/, loader: 'style!css' },
                ],
            },
            output: {
                filename: "site.js"
            },
 plugins: [

new webpack.EnvironmentPlugin({
  NODE_ENV:'production'
}),
    // Define NODE_ENV value that is used 
    // when compiling files with webpack.
     new webpack.DefinePlugin({
    't.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}),
  ]
};
