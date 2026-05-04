const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;

if (!API_URL) {
  console.error('API_URL environment variable is not set');
  process.exit(1);
}

app.use(createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathFilter: '/api',
  on: {
    error: (err, _req, res) => {
      console.error('Proxy error:', err.message);
      res.status(502).json({ message: 'Backend unreachable' });
    },
  },
}));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Frontend server on port ${PORT}, proxying /api → ${API_URL}`));
