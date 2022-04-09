import fetch from 'node-fetch-commonjs';
import config from '../config';

const ACCEPT = 'text/html';
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0';

export class AliexpressService {
  public getPrice = async (): Promise<number | null> => {
    const readCookieResponse = await this._readCookie();
    const writeCookieResponse = await this._writeCookie(readCookieResponse.location);
    const response = await fetch(writeCookieResponse.location, {
      headers: { Accept: ACCEPT, Cookie: writeCookieResponse.cookies, 'User-Agent': USER_AGENT },
      follow: 1,
    });

    const html = await response.text();
    const matches = html.match(/price:(\d+\.\d+);currency:RUB/i);
    if (matches === null) {
      return null;
    }

    return +matches[1];
  };

  protected _readCookie = async (): Promise<{ location: string }> => {
    const response = await fetch(config.aliexpress.itemUrl, {
      headers: { Accept: ACCEPT, 'User-Agent': USER_AGENT },
      redirect: 'manual',
    });

    const location = response.headers.get('location') || '';

    return { location };
  };

  protected _writeCookie = async (url: string): Promise<{ location: string; cookies: string }> => {
    const response = await fetch(url, {
      headers: { Accept: ACCEPT, 'User-Agent': USER_AGENT },
      redirect: 'manual',
    });

    const location = response.headers.get('location') || '';

    const cookieHeader = response.headers.get('set-cookie') || '';
    const cookieMatches =
      cookieHeader.match(/(xman_us_f|xman_f|ali_apache_track|ali_apache_tracktmp|e_id)=(.+?);\s/gi) || [];

    return { location, cookies: cookieMatches.join('') };
  };
}

export default AliexpressService;
