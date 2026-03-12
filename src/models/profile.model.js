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
  return rows[0] || null;
};

export const getById = async id => {
  const { rows } = await db.query(
    'SELECT * FROM profiles where id = $1',
    [id]
  );
  return rows[0] || null;
};

export const update = async (id, profileData) => {
  const updates = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(profileData)) {
    updates.push(`${key} = $${idx++}`);
    values.push(val);
  }

  if (!updates.length) return null;

  values.push(id);
  const { rows } = await db.query(
    `UPDATE profiles SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  return rows[0];
};
