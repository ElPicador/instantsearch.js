module.exports = {
  entry: {
    default: './example/default/app.js',
    ecommerce: './example/ecommerce/app.js'
  },
  devtool: 'source-map',
  output: {
    path: './example/',
    filename: '[name]/bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel'
    }, {
      test: /\.html$/, exclude: /node_modules/, loader: 'raw'
    }]
  },
  devServer: {
    contentBase: 'example/',
    host: '0.0.0.0',
    compress: true
  }
};
