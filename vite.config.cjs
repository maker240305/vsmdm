module.exports = {
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
};
