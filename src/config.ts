import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

export const config = {
  aliexpress: {
    itemUrl: env.ALIEXPRESS_ITEM_URL || '',
  },
  http: {
    port: +(env.HTTP_PORT || 3200),
  },
};

export default config;
