const { createServer } = require("http");
const { promisify } = require("util");

/**
 * @param {import('koa')} app
 * @param {(url: string) => Promise<void>} func
 * @returns {Promise<void>}
 */
module.exports = async function run(app, func) {
  const server = createServer(app.callback());
  return Promise.race([
    (async () => {
      try {
        await promisify((callback) => server.listen(callback))();
        const { port } = /** @type {import('net').AddressInfo} */ (
          server.address()
        );
        await func(`http://127.0.0.1:${port}`);
      } finally {
        if (server.listening) {
          await promisify((callback) =>
            server.close(/** @type {(err?: Error) => void} */ (callback))
          )();
        }
      }
    })(),
    promisify((callback) => server.once("error", callback))(),
  ]);
};
