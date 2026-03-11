import { Pool } from 'pg';

import loadEnv from '../loadEnv.js';
loadEnv();

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error(`PGDATABASE or DATABASE_URL not set`);
}

const config = {};

if (process.env.NODE_ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

export default new Pool(config);
