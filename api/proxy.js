import { createProxyMiddleware } from "http-proxy-middleware";

export default async function handler(req, res) {
  const targetUrl = `https://api.blockchair.com`;

  // Ensure only supported HTTP methods are allowed
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Initialize proxy middleware
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/proxy": "", // Remove /api/proxy prefix
    },
    headers: {
      "User-Agent": "Vercel Proxy",
    },
    secure: true, // Ensure HTTPS connections are enforced
    logLevel: "debug", // Enable logging for debugging in case of issues
  });

  // Use the proxy to handle the request
  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        console.error("Proxy error:", result);
        res.status(500).json({ error: "Proxy error", details: result.message });
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
}
