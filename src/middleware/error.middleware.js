import { ApiError } from '../utils/ApiError.js';

export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed json in request body' });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
