import { httpRequestsTotal, httpRequestDurationMs } from "./metrics.service.js";

/**
 * Middleware يقيس كل HTTP request
 * يُضاف في app.js قبل الـ routes
 */
export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    // نظّف الـ route من الـ params عشان ما يعملش label explosion
    // مثلاً: /api/doctor/638abc... → /api/doctor/:id
    const route = req.route?.path
      ? req.baseUrl + req.route.path
      : req.path.replace(/\/[a-f0-9]{24}/g, "/:id");

    const labels = {
      method: req.method,
      route: route || "unknown",
      status_code: res.statusCode.toString(),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDurationMs.observe(labels, Date.now() - start);
  });

  next();
};
