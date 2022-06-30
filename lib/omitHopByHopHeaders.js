const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

/**
 * @template T
 * @param {Record<string, T>} options
 * @returns {Record<string, T>}
 */
module.exports = function omitHopByHopHeaders(headers) {
  const result = Object.create(null);
  for (const key of Object.keys(headers)) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      continue;
    }
    result[key] = headers[key];
  }
  return result;
};
