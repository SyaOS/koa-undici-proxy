const { Client } = require("undici");
const omitHopByHopHeaders = require("./omitHopByHopHeaders");

/**
 * @param {URL | string | Client} url
 * @returns {import('koa').Middleware}
 */
function proxy(url) {
  const client = url instanceof Client ? url : new Client(url);
  return async (context) => {
    const headers = omitHopByHopHeaders(context.req.headers);
    delete headers.host;

    context.body = context.req.pipe(
      client.pipeline(
        {
          method: /** @type {import('undici').Dispatcher.HttpMethod} */ (
            context.method
          ),
          path: context.url,
          headers,
          opaque: context.response,
        },
        ({ statusCode, headers, body, opaque }) => {
          const response = /** @type {import('koa').Response} */ (opaque);
          response.status = statusCode;
          response.set(omitHopByHopHeaders(headers));
          return body;
        }
      )
    );
  };
}

module.exports = proxy;
