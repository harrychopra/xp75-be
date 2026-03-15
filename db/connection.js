import dotenv from 'dotenv';
import { Pool } from 'pg';

process.env.NODE_ENV ||= 'development';
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL not set`);
}

const config = { connectionString: process.env.DATABASE_URL };
if (process.env.NODE_ENV === 'production') config.max = 2;

export default new Pool(config);
