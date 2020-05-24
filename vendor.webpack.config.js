const webpack = require('webpack')
const path = require('path')

const getEnv = () =>
  process.env.NODE_ENV !== 'development' ? 'production' : 'development'

const isDev = () => process.env.NODE_ENV !== 'development'

module.exports = {
  mode: 'development',
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'classnames'],
  },
  output: {
    filename: 'js/vendor.bundle.js',
    path: path.resolve(__dirname, 'build'),
    library: 'vendor_lib',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_lib',
      path: 'build/vendor-manifest.json',
    }),
  ],
}
