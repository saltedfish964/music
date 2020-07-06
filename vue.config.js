module.exports = {
  // publicPath: '/music/',
  publicPath: './',
  devServer: {
    proxy: {
      '/': {
        target: 'https://netease.bluej.cn',
        // target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
