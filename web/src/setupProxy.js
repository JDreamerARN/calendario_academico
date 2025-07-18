const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: function(proxyReq, req, res) {
        console.log('Proxying:', req.method, req.url);
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
      }
    })
  );
}; 