import Koa from 'koa';
import Router from 'koa-router';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import serve from 'koa-static';
import NodeCache from 'node-cache';
import AliexpressController from './controllers/aliexpress';
import AliexpressService from './services/aliexpress';

const MS_IN_WEEK = 1000 * 60 * 60 * 24 * 7;

export function createApp() {
  const cache = new NodeCache();
  const service = new AliexpressService();
  const aliexpressController = new AliexpressController(cache, service);

  const router = new Router();
  router.get('/api/v1/aliexpress', aliexpressController.get);

  const app = new Koa();

  if (process.env.NODE_ENV !== 'development') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          fontSrc: ["'self'", 'https:', 'data:'],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      })
    );
  }

  app.use(helmet.referrerPolicy());
  app.use(helmet.noSniff());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.hidePoweredBy());

  app.use(cors());
  app.use(conditional());
  app.use(etag());
  app.use(serve('public', { maxAge: MS_IN_WEEK }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
