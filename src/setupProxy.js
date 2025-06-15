import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "api/items",
    createProxyMiddleware({
      target: "http://localhost:2000/",
      changeOrigin: true,
    })
  );
  app.use(
    "api/read_image",
    createProxyMiddleware({
      target: "http://localhost:8000/",
      changeOrigin: true,
    })
  );
};
