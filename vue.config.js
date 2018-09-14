module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/games': {
        target: 'http://localhost:8001/',
        changeOrigin: true
      }
    }
  }
}
