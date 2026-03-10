import dotenv from 'dotenv';
import { Pool } from 'pg';

process.env.NODE_ENV ||= 'development';
const envPath = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

if (!process.env.PG_DATABASE && !process.env.DATABASE_URL) {
  throw new Error(`PG_DATABASE or DATABASE_URL not set`);
}

const config = {};

if (process.env.NODE_ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

export default new Pool(config);
