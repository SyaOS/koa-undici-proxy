export = proxy;
/**
 * @param {URL | string | Client} url
 * @returns {import('koa').Middleware}
 */
declare function proxy(url: URL | string | Client): import('koa').Middleware;
import { Client } from "undici";
