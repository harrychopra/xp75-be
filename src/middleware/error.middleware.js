import { APIError } from './errors.js';

export default function errorHandler(err, req, res, next) {
  if (err instanceof APIError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
