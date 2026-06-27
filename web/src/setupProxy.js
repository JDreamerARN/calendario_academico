const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_TARGET || 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      // CRA strips the /api mount path; restore it so Spring routes match /api/auth/**
      pathRewrite: (path) => `/api${path}`,
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