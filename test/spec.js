const Koa = require("koa");
const should = require("should");
const { request } = require("undici");
const proxy = require("..");
const run = require("./run");

describe("koa-undici-proxy", function () {
  this.timeout(60000);

  it("should pass currect requests", async function () {
    await run(new Koa().use(proxy("https://httpbin.org")), async (url) => {
      const response = await request(url + `/anything`, {
        method: "POST",
        headers: {
          "X-Foo": "bar",
        },
        body: "baz",
        throwOnError: true,
      });

      await should(response.body.json()).eventually.match({
        method: "POST",
        url: "https://httpbin.org/anything",
        headers: {
          "X-Foo": "bar",
        },
        data: "baz",
      });
    });
  });

  describe("should pass currect responses", function () {
    it("status code", async function () {
      await run(new Koa().use(proxy("https://httpbin.org")), async (url) => {
        const response = await request(url + `/status/204`, {
          throwOnError: true,
        });

        should(response.statusCode).eql(204);
      });
    });

    it("headers", async function () {
      await run(new Koa().use(proxy("https://httpbin.org")), async (url) => {
        const response = await request(url + `/response-headers?foo=bar`, {
          throwOnError: true,
        });

        should(response.headers).match({ foo: "bar" });
      });
    });

    it("body", async function () {
      await run(new Koa().use(proxy("https://httpbin.org")), async (url) => {
        const response = await request(
          url + `/base64/SFRUUEJJTiBpcyBhd2Vzb21l`,
          {
            throwOnError: true,
          }
        );

        await should(response.body.text()).eventually.eql("HTTPBIN is awesome");
      });
    });
  });
});
