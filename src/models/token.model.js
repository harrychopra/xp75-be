import db from '../../db/connection.js';

export async function create(userId, hash, expiresAt) {
  await db.query(
    `INSERT INTO tokens (user_id, hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hash, expiresAt]
  );
}

export async function find(hash) {
  const result = await db.query(
    `SELECT id, user_id, expires_at, revoked FROM tokens
     WHERE hash = $1`,
    [hash]
  );
  return result.rows[0] || null;
}

export async function revokeTokenById(id) {
  await db.query('UPDATE tokens SET revoked = TRUE WHERE id = $1', [id]);
}

export async function revokeTokenByHash(hash) {
  await db.query('UPDATE tokens SET revoked = TRUE WHERE hash = $1', [hash]);
}

export async function revokeAllUserTokens(userId) {
  await db.query(
    'UPDATE tokens SET revoked = TRUE WHERE user_id = $1 AND revoked = FALSE',
    [userId]
  );
}
