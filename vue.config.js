module.exports = {
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
