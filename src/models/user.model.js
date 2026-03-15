import db from '../../db/connection.js';

export async function createUser(
  { email, name, passwordHash, avatarUrl }
) {
  const result = await db.query(
    `INSERT INTO users ( email, name, password_hash, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id,  email, name, avatar_url, created_at`,
    [email, name, passwordHash, avatarUrl || null]
  );
  return result.rows[0];
}

export async function findByEmail(email) {
  const result = await db.query(
    'SELECT id, email, name, password_hash, avatar_url FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function findById(id) {
  const result = await db.query(
    'SELECT id, email, name, password_hash, avatar_url FROM users WHERE id = $1',
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

export async function updateProfile(userId, { name, avatarUrl }) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(name);
  }
  if (avatarUrl !== undefined) {
    fields.push(`avatar_url = $${idx++}`);
    values.push(avatarUrl);
  }

  fields.push(`updated_at = NOW()`);

  values.push(userId);

  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}
     RETURNING id, name, email, avatar_url`,
    values
  );
  return result.rows[0];
}

export async function updatePassword(userId, newPasswordHash) {
  const result = await db.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newPasswordHash, userId]
  );
  if (result.rowCount !== 1) throw new Error('Failed to update password');
}
