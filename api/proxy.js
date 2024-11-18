const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy middleware options
const proxyOptions = {
  target: "https://api.blockchair.com",
  changeOrigin: true,
  pathRewrite: {
    "^/api/proxy": "", // Remove /api/proxy prefix
  },
  headers: {
    "User-Agent": "AWS EC2 Proxy",
  },
  secure: true,
  logLevel: "debug",
};

// Initialize proxy middleware
app.use("/api/proxy", createProxyMiddleware(proxyOptions));

// Start the server
app.listen(PORT, "::", () => {
  console.log(`Server is running on port ${PORT}`);
});
