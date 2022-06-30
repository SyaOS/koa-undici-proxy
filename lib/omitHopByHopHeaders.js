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
 * @param {Record<string, string | string[] | undefined>} headers
 * @returns {Record<string, string | string[]>}
 */
function omitHopByHopHeaders(headers) {
  const result = Object.create(null);
  for (const key of Object.keys(headers)) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) continue;
    const value = headers[key];
    if (value === undefined) continue;
    result[key] = value;
  }
  return result;
}

module.exports = omitHopByHopHeaders;
