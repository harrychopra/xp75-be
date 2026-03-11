import db from '../../config/db/connection.js';

export const create = async (id, email, username, name) => {
  const { rows } = await db.query(
    'INSERT INTO profiles (id, email, username, name) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, email, username, name]
  );
  return rows[0];
};

export const getByEmail = async email => {
  const { rows } = await db.query(
    'SELECT * FROM profiles where email = $1',
    [email]
  );
  console.log(rows[0]);
  return rows[0] || null;
};

export const getById = async id => {
  const { rows } = await db.query(
    'SELECT * FROM profiles where email = $1',
    [id]
  );
  return rows[0] || null;
};
