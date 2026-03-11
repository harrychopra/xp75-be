import db from '../../config/db/connection.js';

export const create = async id => {
  const { rows } = await db.query(
    'INSERT INTO users (id) VALUES ($1) RETURNING *',
    [id]
  );
  return rows[0];
};
