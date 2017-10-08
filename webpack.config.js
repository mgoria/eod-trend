module.exports = {
  entry: "./src/js/main.es6",
  output: {
    path: __dirname,
    filename: "./dist/bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.es6$/,
        query: {
          presets: 'es2015',
        },
      }
    ]
  },
};