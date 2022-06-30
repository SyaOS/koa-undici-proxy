const { Client } = require("undici");
const omitHopByHopHeaders = require("./omitHopByHopHeaders");

/**
 * @param {URL | string | Client} url
 * @returns {import('koa').Middleware}
 */
module.exports = (url) => {
  const client = url instanceof Client ? url : new Client(url);
  return async (context) => {
    const headers = omitHopByHopHeaders(context.req.headers);
    delete headers.host;

    context.body = context.req.pipe(
      client.pipeline(
        {
          method: context.method,
          path: context.url,
          headers,
          opaque: context.response,
        },
        ({ statusCode, headers, body, opaque }) => {
          /** @type {import('koa').Response} */
          const response = opaque;
          response.status = statusCode;
          response.set(omitHopByHopHeaders(headers));
          return body;
        }
      )
    );
  };
};
