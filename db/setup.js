import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import db from './connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await db.query(schema);
  console.log('[DB setup successful]');
} catch (err) {
  console.error('[DB setup failed]:', err.message);
  process.exit(1);
} finally {
  await db.end();
}
