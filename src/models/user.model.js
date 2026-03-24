import db from '../../db/connection.js';

export async function create(email, name, password_hash, avatar_key) {
  const { rows } = await db.query(
    `INSERT INTO users (email, name, password_hash, avatar_key)
     VALUES ($1, $2, $3, $4)
     RETURNING id,  email, name, avatar_key`,
    [email, name, password_hash, avatar_key]
  );
  return rows[0] || null;
}

export async function findByEmail(email) {
  const result = await db.query(
    'SELECT id, email, name, password_hash, avatar_key FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function find(id) {
  const result = await db.query(
    'SELECT id, email, name, password_hash, avatar_key FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function isEmailTaken(email) {
  const result = await db.query('SELECT id FROM users WHERE email = $1', [
    email
  ]);
  return result.rows.length > 0;
}

export async function update({ user_id, name, avatar_key }) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(name);
  }

  if (avatar_key !== undefined) {
    fields.push(`avatar_key = $${idx++}`);
    values.push(avatar_key);
  }

  fields.push(`updated_at = NOW()`);
  values.push(user_id);

  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}
     RETURNING id, name, email, avatar_key`,
    values
  );
  return result.rows[0];
}

export async function changePassword(userId, newPasswordHash) {
  const result = await db.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newPasswordHash, userId]
  );
  if (result.rowCount !== 1) throw new Error('Failed to update password');
}
