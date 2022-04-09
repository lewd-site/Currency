import Koa from 'koa';
import NodeCache from 'node-cache';
import AliexpressService from '../services/aliexpress';

const CACHE_KEY = 'aliexpress';
const CACHE_TTL = 60 * 60;

export class AliexpressController {
  public constructor(protected readonly cache: NodeCache, protected readonly aliexpressService: AliexpressService) {}

  public get = async (ctx: Koa.Context) => {
    const cachedResult = this.cache.get(CACHE_KEY);
    if (typeof cachedResult !== 'undefined') {
      ctx.set('Content-Type', 'application/json');
      ctx.body = { price: cachedResult };
      return;
    }

    const result = await this.aliexpressService.getPrice();
    if (result === null) {
      ctx.status = 404;
      return;
    }

    this.cache.set(CACHE_KEY, result, CACHE_TTL);

    ctx.set('Content-Type', 'application/json');
    ctx.body = { price: result };
  };
}

export default AliexpressController;
